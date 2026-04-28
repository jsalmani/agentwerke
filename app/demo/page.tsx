import Chat from '@/app/components/Chat';

export const metadata = {
  title: 'Try Avery — Agentwerke',
  description:
    "Avery is the agent on our website. She's a real Claude agent — same kind we build for clients. Ask her anything.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">
        {/* Page header */}
        <div className="mb-10">
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            ← Agentwerke
          </a>
          <h1 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
            Talk to Avery
          </h1>
          <p className="mt-3 text-zinc-600 max-w-2xl">
            Avery is the agent on our website. She's a real Claude agent — the same kind we build for
            clients. She can answer your questions, walk through what we charge, and book a discovery
            call with Jason if you want to talk further.
          </p>
        </div>

        {/* Two-column: chat + side info */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[700px]">
            <Chat vertical="parent" />
          </div>

          <aside className="space-y-6 text-sm text-zinc-600">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                What's actually happening
              </h2>
              <p className="leading-relaxed">
                Every message you send goes to Claude (Haiku 4.5) on Anthropic's API. Avery has tools
                to read Jason's calendar, book a confirmed call, and queue a follow-up email. Nothing
                here is mocked.
              </p>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                The stack
              </h2>
              <ul className="space-y-1.5">
                <li>· Claude Haiku 4.5 + Sonnet 4.6</li>
                <li>· Vercel AI SDK 6 · Next.js 15</li>
                <li>· Cal.com (booking) · Resend (email)</li>
                <li>· Supabase (audit + persistence)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                Want one for your business?
              </h2>
              <p className="leading-relaxed">
                Just ask Avery to book you a call. Or email{' '}
                <a className="underline hover:text-zinc-900" href="mailto:hello@agentwerke.com">
                  hello@agentwerke.com
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
