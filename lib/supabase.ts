/**
 * Supabase persistence layer.
 *
 * Four tables (see supabase-schema.sql):
 *   - sessions:     one row per conversation
 *   - messages:     one row per user/assistant turn
 *   - tool_calls:   one row per tool execution (audit trail)
 *   - leads:        denormalized founder-facing pipeline view
 *
 * We use the service-role key on the server side. NEVER expose this key to
 * the client. The chat UI talks to our /api/chat route; only that route
 * touches Supabase directly.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!cachedClient) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }
    cachedClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

/* ─── Sessions ─────────────────────────────────────────────────────────── */

export interface Session {
  id: string;
  created_at: string;
  visitor_fingerprint?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  status: 'active' | 'booked' | 'lead_captured' | 'abandoned';
}

export async function createSession(input: {
  visitorFingerprint?: string;
  utmSource?: string;
  utmCampaign?: string;
}): Promise<Session> {
  const { data, error } = await getSupabase()
    .from('sessions')
    .insert({
      visitor_fingerprint: input.visitorFingerprint ?? null,
      utm_source: input.utmSource ?? null,
      utm_campaign: input.utmCampaign ?? null,
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data as Session;
}

export async function updateSessionStatus(
  sessionId: string,
  status: Session['status']
) {
  const { error } = await getSupabase()
    .from('sessions')
    .update({ status })
    .eq('id', sessionId);
  if (error) throw error;
}

/* ─── Messages ─────────────────────────────────────────────────────────── */

export async function logMessage(input: {
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  latencyMs?: number;
}) {
  const { error } = await getSupabase().from('messages').insert({
    session_id: input.sessionId,
    role: input.role,
    content: input.content,
    input_tokens: input.inputTokens ?? null,
    output_tokens: input.outputTokens ?? null,
    cache_read_tokens: input.cacheReadTokens ?? null,
    cache_write_tokens: input.cacheWriteTokens ?? null,
    latency_ms: input.latencyMs ?? null,
  });
  if (error) console.error('Failed to log message:', error); // non-fatal
}

/* ─── Tool calls (audit trail) ─────────────────────────────────────────── */

export async function logToolCall(input: {
  sessionId: string;
  toolName: string;
  input: unknown;
  output: unknown;
  durationMs: number;
  succeeded: boolean;
  error?: string;
}) {
  const { error } = await getSupabase().from('tool_calls').insert({
    session_id: input.sessionId,
    tool_name: input.toolName,
    input: input.input,
    output: input.output,
    duration_ms: input.durationMs,
    succeeded: input.succeeded,
    error: input.error ?? null,
  });
  if (error) console.error('Failed to log tool call:', error);
}

/* ─── Leads (founder-facing pipeline) ──────────────────────────────────── */

export async function upsertLead(input: {
  sessionId: string;
  name?: string;
  email: string;
  reason?: string;
  bookingId?: number;
  bookingTime?: string;
  status: 'lead' | 'booked' | 'no_show' | 'closed_won' | 'closed_lost';
}) {
  const { error } = await getSupabase().from('leads').upsert(
    {
      session_id: input.sessionId,
      name: input.name ?? null,
      email: input.email,
      reason: input.reason ?? null,
      booking_id: input.bookingId ?? null,
      booking_time: input.bookingTime ?? null,
      status: input.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'email' }
  );
  if (error) throw error;
}
