'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';

type Vertical = 'parent' | 'brokerage';

interface ChatProps {
  vertical?: Vertical;
}

const AGENT_NAME = process.env.NEXT_PUBLIC_AGENT_NAME || 'Avery';

const VERTICAL_COPY: Record<
  Vertical,
  { tagline: string; welcome: string; quickReplies: string[]; helpEmail: string; footnote?: string }
> = {
  parent: {
    tagline: "Agentwerke's website agent · powered by Claude",
    welcome:
      "Hi — I'm Avery, the agent on Agentwerke's website. I can answer questions about what we do, walk you through pricing, and book you a discovery call with Jason if you're interested.",
    quickReplies: ['What do you do?', 'How much does this cost?', 'Book a discovery call'],
    helpEmail: 'hello@agentwerke.com',
  },
  brokerage: {
    tagline: 'Agentwerke for Broker-Dealers · powered by Claude',
    welcome:
      "I'm Avery, the agent on Agentwerke's broker-dealer page. I can walk you through what we build for independent BDs, talk pricing and process, and book a 30-minute call with Jason if you want to take it further.",
    quickReplies: [
      'What do you build for BDs?',
      'How does this work with our WSPs?',
      'Pricing for our firm',
      'Book a call',
    ],
    helpEmail: 'brokerage@agentwerke.com',
    footnote:
      'Transcripts retained under Agentwerke privacy policy. Avery is not a substitute for legal or compliance advice.',
  },
};

export default function Chat({ vertical = 'parent' }: ChatProps) {
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const copy = VERTICAL_COPY[vertical];
  const isBrokerage = vertical === 'brokerage';

  const transport = new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ messages, body }) => ({
      body: {
        messages,
        sessionId,
        vertical,
        ...(body || {}),
      },
    }),
    fetch: async (...args) => {
      const res = await fetch(...args);
      const sid = res.headers.get('x-session-id');
      if (sid && sid !== sessionId) setSessionId(sid);
      return res;
    },
  });

  // `ai` and `@ai-sdk/react/node_modules/ai` resolve to two distinct package
  // copies in this project, so DefaultChatTransport looks structurally
  // different to TS even though it's runtime-identical. The cast is a
  // pinhole; a real fix would dedupe with an `overrides` entry in
  // package.json, which is out of scope for this design pass.
  const { messages, sendMessage, status, error } = useChat({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transport: transport as any,
  });

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

  // Subtle differences between verticals: brokerage uses tighter corners,
  // navy ink, monospace tagline; parent uses rounded corners + warm shadow.
  const surfaceClasses = isBrokerage
    ? 'bg-card border border-rule rounded-md shadow-card'
    : 'bg-card border border-rule rounded-xl shadow-warm';

  const avatarClasses = isBrokerage
    ? 'w-9 h-9 rounded-sm bg-[var(--ink)] text-white flex items-center justify-center text-sm font-medium'
    : 'w-9 h-9 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-sm font-medium';

  const sendBtnClasses = isBrokerage
    ? 'px-4 py-2 text-sm font-medium text-white bg-[var(--ink)] rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition'
    : 'px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition';

  const userBubbleClasses = isBrokerage
    ? 'bg-[var(--ink)] text-white rounded-md'
    : 'bg-[var(--ink)] text-white rounded-2xl';

  const assistantBubbleClasses = isBrokerage
    ? 'bg-[var(--paper-2)] text-ink rounded-md'
    : 'bg-[var(--paper-2)] text-ink rounded-2xl';

  return (
    <div className={`flex flex-col h-full max-h-[80vh] ${surfaceClasses}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-rule">
        <div className={avatarClasses}>A</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-ink">{AGENT_NAME}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-mute">
              <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              live
            </span>
          </div>
          <div className={`text-xs ${isBrokerage ? 'font-mono' : ''} text-mute truncate`}>
            {copy.tagline}
          </div>
        </div>
      </div>

      {/* Message list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm leading-relaxed text-ink-soft">
            <p className="mb-3">{copy.welcome}</p>
            <p className="text-mute">Pick a starting point below or just ask me anything.</p>
          </div>
        )}

        {messages.map((m) => (
          <Message
            key={m.id}
            message={m}
            userBubble={userBubbleClasses}
            assistantBubble={assistantBubbleClasses}
            isBrokerage={isBrokerage}
          />
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex items-center gap-1 text-mute px-1">
            <span className="thinking-dot w-1.5 h-1.5 bg-[var(--mute)] rounded-full" />
            <span className="thinking-dot w-1.5 h-1.5 bg-[var(--mute)] rounded-full" />
            <span className="thinking-dot w-1.5 h-1.5 bg-[var(--mute)] rounded-full" />
          </div>
        )}

        {error && (
          <div className="text-sm text-[#a1331c] bg-[var(--accent-soft)] border border-rule rounded-md px-3 py-2">
            Something hiccuped on our end. Try sending that again — or email{' '}
            <a className="underline" href={`mailto:${copy.helpEmail}`}>
              {copy.helpEmail}
            </a>{' '}
            and I'll respond directly.
          </div>
        )}
      </div>

      {/* Quick replies (only on first turn) */}
      {messages.length === 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {copy.quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              disabled={!isReady}
              className={`text-sm px-3 py-1.5 border border-rule ${
                isBrokerage ? 'rounded-sm' : 'rounded-full'
              } text-ink-soft hover:bg-[var(--paper-2)] hover:border-[var(--ink-soft)]/40 transition disabled:opacity-50`}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-rule px-3 py-3 flex gap-2 bg-card rounded-b-[inherit]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${AGENT_NAME} anything...`}
          disabled={!isReady}
          className={`flex-1 px-3 py-2 text-sm bg-transparent border border-rule ${
            isBrokerage ? 'rounded-md' : 'rounded-md'
          } text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50`}
        />
        <button type="submit" disabled={!isReady || !input.trim()} className={sendBtnClasses}>
          Send
        </button>
      </form>

      {copy.footnote && (
        <div className="px-5 py-2 text-[11px] font-mono text-mute border-t border-rule bg-[var(--paper-2)] rounded-b-[inherit]">
          {copy.footnote}
        </div>
      )}
    </div>
  );
}

/* ─── Message rendering ──────────────────────────────────────────────────── */

interface MessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    parts?: Array<{ type: string; text?: string; toolName?: string }>;
  };
  userBubble: string;
  assistantBubble: string;
  isBrokerage: boolean;
}

function Message({ message, userBubble, assistantBubble, isBrokerage }: MessageProps) {
  if (message.role === 'system') return null;

  const isUser = message.role === 'user';
  const textParts = (message.parts || [])
    .filter((p) => p.type === 'text')
    .map((p) => p.text || '')
    .join('');

  const toolParts = (message.parts || []).filter((p) => p.type.startsWith('tool-'));

  const bubble = isUser ? userBubble : assistantBubble;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${bubble}`}
      >
        {toolParts.length > 0 && !isUser && (
          <div className="mb-2 space-y-1">
            {toolParts.map((tp, i) => (
              <div
                key={i}
                className={`inline-flex items-center gap-1.5 text-[11px] ${
                  isBrokerage ? 'font-mono' : ''
                } text-mute`}
                title={tp.type}
              >
                <span className="inline-block w-1 h-1 rounded-full bg-[var(--accent)]" />
                Using {humanizeToolName(tp.type.replace(/^tool-/, ''))}…
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
