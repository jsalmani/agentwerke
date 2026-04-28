import Link from 'next/link';
import Chat from '@/app/components/Chat';

export const metadata = {
  title: 'Try Avery — Agentwerke',
  description:
    "Avery is the agent on our website. She's a real Claude agent — same kind we build for clients. Ask her anything.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* ─── Trimmed header ───────────────────────────────────────────────── */}
      <header className="border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition"
          >
            <span aria-hidden>←</span>
            <span className="font-display text-[17px] tracking-tight text-ink">Agentwerke</span>
          </Link>
          <div className="flex items-center gap-6 text-mute">
            <Link href="/brokerage" className="hover:text-ink transition">
              For Broker-Dealers
            </Link>
            <a href="mailto:hello@agentwerke.com" className="hover:text-ink transition">
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* ─── Page intro ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 lg:pt-16">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="eyebrow eyebrow-accent mb-4">
              <span className="inline-block live-dot w-1.5 h-1.5 rounded-full bg-[var(--success)] mr-2 align-middle" />
              Live demo · powered by Claude
            </div>
            <h1 className="font-display font-medium text-[40px] sm:text-[52px] lg:text-[64px] leading-[1.04] tracking-[-0.02em] text-ink">
              Talk to Avery.
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] lg:text-lg text-ink-soft leading-relaxed">
              Avery is the agent on Agentwerke's website — a real Claude agent, the same kind we
              build for clients. She can answer your questions, walk through what we charge, and
              book a discovery call with Jason if you want to talk further.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-mute space-y-1.5">
              <div className="flex justify-between gap-3 border-b border-rule pb-1.5">
                <span>Model</span>
                <span className="text-ink-soft">Claude Haiku 4.5</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-rule pb-1.5">
                <span>Escalation</span>
                <span className="text-ink-soft">Sonnet 4.6</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-rule pb-1.5">
                <span>Tools</span>
                <span className="text-ink-soft">4 active</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Status</span>
                <span className="text-[var(--success)] inline-flex items-center gap-1.5">
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Chat as centerpiece ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[640px] lg:h-[720px] order-1 lg:order-1">
            <Chat vertical="parent" />
          </div>

          <aside className="space-y-8 order-2 lg:order-2 lg:pt-2">
            <SideBlock title="What's actually happening">
              Every message you send goes to Claude (Haiku 4.5) on Anthropic's API. Avery has tools
              to read Jason's calendar, book a confirmed call, and queue a follow-up email. Nothing
              here is mocked.
            </SideBlock>

            <SideBlock title="The stack">
              <ul className="space-y-1.5 font-mono text-[12px] text-ink-soft">
                <li>· Claude Haiku 4.5 + Sonnet 4.6</li>
                <li>· Vercel AI SDK 6 · Next.js 15</li>
                <li>· Cal.com (booking)</li>
                <li>· Resend (email)</li>
                <li>· Supabase (audit + persistence)</li>
              </ul>
            </SideBlock>

            <SideBlock title="What Avery won't do">
              <ul className="space-y-2 text-[14px] text-ink-soft">
                <li>· Hallucinate prices not in our knowledge base</li>
                <li>· Promise deliverables outside our productized scope</li>
                <li>· Book without confirming time, name, and email first</li>
              </ul>
            </SideBlock>

            <SideBlock title="Want one for your business?">
              Just ask Avery to book you a call. Or email{' '}
              <a className="underline hover:text-ink transition" href="mailto:hello@agentwerke.com">
                hello@agentwerke.com
              </a>
              .
            </SideBlock>
          </aside>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-mute">
          <span>Agentwerke · Chapel Hill, NC · © 2026</span>
          <span className="font-mono text-[11px] tracking-wide">BUILT ON ANTHROPIC CLAUDE</span>
        </div>
      </footer>
    </main>
  );
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-3 pb-2 border-b border-rule">{title}</div>
      <div className="text-[14px] leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}
