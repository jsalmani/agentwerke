'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';

const QUICK_REPLIES = [
  'What do you do?',
  'How much does this cost?',
  'Book a discovery call',
];

const AGENT_NAME = process.env.NEXT_PUBLIC_AGENT_NAME || 'Avery';

export default function Chat() {
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // Echo the sessionId back on every request so the audit trail stays linked.
      // First request has no sessionId; the API mints one and returns it in
      // x-session-id, which we pull off in the fetch hook below.
      prepareSendMessagesRequest: ({ messages, body }) => ({
        body: { ...body, messages, sessionId },
      }),
      fetch: async (...args) => {
        const res = await fetch(...args);
        const sid = res.headers.get('x-session-id');
        if (sid && sid !== sessionId) setSessionId(sid);
        return res;
      },
    }),
  });

  // Auto-scroll to the bottom on new messages.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  const isReady = status === 'ready';
  const isStreaming = status === 'streaming' || status === 'submitted';

  const handleQuickReply = (reply: string) => {
    if (!isReady) return;
    sendMessage({ text: reply });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !isReady) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-white border border-zinc-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center text-white font-medium text-sm">
          A
        </div>
        <div>
          <div className="font-medium text-sm text-zinc-900">{AGENT_NAME}</div>
          <div className="text-xs text-zinc-500">Agentwerke's website agent · powered by Claude</div>
        </div>
      </div>

      {/* Message list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-zinc-700 text-sm leading-relaxed">
            <p className="mb-3">
              Hi — I'm {AGENT_NAME}, the agent on Agentwerke's website. I can answer questions about what we do,
              walk you through pricing, and book you a discovery call with Jason if you're interested.
            </p>
            <p className="text-zinc-500">Pick a starting point below or just ask me anything.</p>
          </div>
        )}

        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex items-center gap-1 text-zinc-400 px-1">
            <span className="thinking-dot w-1.5 h-1.5 bg-zinc-400 rounded-full" />
            <span className="thinking-dot w-1.5 h-1.5 bg-zinc-400 rounded-full" />
            <span className="thinking-dot w-1.5 h-1.5 bg-zinc-400 rounded-full" />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            Something hiccuped on our end. Try sending that again — or email{' '}
            <a className="underline" href="mailto:hello@agentwerke.com">
              hello@agentwerke.com
            </a>{' '}
            and I'll respond directly.
          </div>
        )}
      </div>

      {/* Quick replies (only on first turn) */}
      {messages.length === 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              disabled={!isReady}
              className="text-sm px-3 py-1.5 border border-zinc-300 rounded-full hover:bg-zinc-50 hover:border-zinc-400 transition-colors disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-200 px-3 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${AGENT_NAME} anything...`}
          disabled={!isReady}
          className="flex-1 px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!isReady || !input.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

/* ─── Message rendering ──────────────────────────────────────────────────── */

interface MessageProps {
  // Loose typing here — UIMessage shapes vary across SDK versions; we just need
  // role + parts.
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    parts?: Array<{ type: string; text?: string; toolName?: string }>;
  };
}

function Message({ message }: MessageProps) {
  if (message.role === 'system') return null; // never render system messages

  const isUser = message.role === 'user';

  // Pull text parts; render tool-call indicators inline.
  const textParts = (message.parts || [])
    .filter((p) => p.type === 'text')
    .map((p) => p.text || '')
    .join('');

  const toolParts = (message.parts || []).filter((p) => p.type.startsWith('tool-'));

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'
        }`}
      >
        {toolParts.length > 0 && !isUser && (
          <div className="mb-2 space-y-1">
            {toolParts.map((tp, i) => (
              <div
                key={i}
                className="text-xs text-zinc-500 italic"
                title={tp.type}
              >
                ⚙ Using {humanizeToolName(tp.type.replace(/^tool-/, ''))}…
              </div>
            ))}
          </div>
        )}
        {textParts || (toolParts.length > 0 ? '' : '(empty)')}
      </div>
    </div>
  );
}

function humanizeToolName(toolName: string): string {
  switch (toolName) {
    case 'getAvailableSlots':
      return "Jason's calendar";
    case 'bookDiscoveryCall':
      return 'the booking system';
    case 'captureLead':
      return 'the contact list';
    case 'handoffToHuman':
      return 'a note to Jason';
    default:
      return toolName;
  }
}
