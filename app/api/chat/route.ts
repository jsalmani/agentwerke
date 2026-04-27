/**
 * /api/chat — the main Avery endpoint.
 *
 * Receives the chat history from the browser via Vercel AI SDK's useChat hook,
 * runs Claude with our tools, and streams the response back. Persists every
 * turn to Supabase for the audit trail and pipeline view.
 *
 * Architecture choices worth knowing:
 *   - We use Claude Haiku 4.5 by default. It's 4-5x faster than Sonnet on TTFT
 *     and 1/3 the cost. Sonnet for complex reasoning escalations (not implemented
 *     in v1 — we'll add a router later if Haiku underperforms in practice).
 *
 *   - System prompt + KB are sent with cacheControl: "1h". 90% off on cache reads,
 *     ~50ms cached prefill vs ~800ms cold. Pass ttl: '1h' explicitly because
 *     Anthropic silently reverted the default to 5-min in March 2026.
 *
 *   - stopWhen: stepCountIs(6) — Claude takes at most 6 reasoning/tool-call
 *     steps before finalizing. Avery should rarely need more than 3-4.
 *
 *   - Session tracking: client sends a sessionId or asks us to mint one. The
 *     sessionId scopes all tool-call audit logs to a single conversation.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { buildSystemMessage } from '@/lib/system-prompt';
import { buildTools } from '@/lib/tools';
import { createSession, logMessage } from '@/lib/supabase';

// Tell Vercel this is a Node.js route (not Edge) — Anthropic SDK + Resend SDK
// are both Node-friendly; Edge would force us into fetch-only territory.
export const runtime = 'nodejs';

// Allow up to 60 seconds for the full agent loop (tool calls + reasoning).
export const maxDuration = 60;

interface ChatRequestBody {
  messages: UIMessage[];
  sessionId?: string;
  utm?: { source?: string; campaign?: string };
}

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messages, sessionId: clientSessionId, utm } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'messages array is required' }, { status: 400 });
  }

  // Mint a session on first message. Client should echo this back on subsequent
  // requests so the audit trail stays linked.
  let sessionId = clientSessionId;
  if (!sessionId) {
    const session = await createSession({
      utmSource: utm?.source,
      utmCampaign: utm?.campaign,
    });
    sessionId = session.id;
  }

  // Log the latest user message before invoking the model (so we capture it
  // even if generation fails).
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  if (lastUserMessage) {
    const text = extractText(lastUserMessage);
    if (text) {
      await logMessage({ sessionId, role: 'user', content: text });
    }
  }

  const t0 = Date.now();

  const result = streamText({
    // Default to Haiku 4.5 for speed. Override per-deploy via env if you want Sonnet.
    model: anthropic(process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5'),
    system: buildSystemMessage(),
    messages: convertToModelMessages(messages),
    tools: buildTools(sessionId),
    stopWhen: stepCountIs(6),
    temperature: 0.4, // Conversational, but consistent

    // Hook to log the final assistant turn after streaming completes.
    onFinish: async (event) => {
      const latencyMs = Date.now() - t0;
      const usage = event.totalUsage;
      await logMessage({
        sessionId: sessionId!,
        role: 'assistant',
        content: event.text || '(tool-only response)',
        inputTokens: usage?.inputTokens,
        outputTokens: usage?.outputTokens,
        cacheReadTokens: usage?.cachedInputTokens,
        latencyMs,
      });
    },
  });

  // Stream back to the client. We attach the sessionId in a custom header so
  // the client can persist it in component state for the rest of the convo.
  const response = result.toUIMessageStreamResponse();
  response.headers.set('x-session-id', sessionId);
  return response;
}

/**
 * Pull plain text out of a UIMessage. UIMessages have a `parts` array with
 * `type: 'text'` parts; we concatenate the text from those.
 */
function extractText(message: UIMessage): string {
  if (!message.parts) return '';
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}
