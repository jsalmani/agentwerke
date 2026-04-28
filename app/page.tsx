import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-20">
          <div className="text-lg font-semibold tracking-tight">Agentwerke</div>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="/brokerage" className="hover:text-zinc-900">
              For Broker-Dealers
            </Link>
            <Link href="/demo" className="hover:text-zinc-900">
              Try Avery
            </Link>
            <a href="mailto:hello@agentwerke.com" className="hover:text-zinc-900">
              Contact
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.05]">
            Custom Claude agents that handle the office work draining your team.
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-zinc-600 leading-relaxed">
            We build production-grade AI agents for small businesses. Office manager work, customer
            intake, scheduling, follow-ups. Live in two weeks. $12,000 setup plus $1,000/month —
            roughly one-third the cost of an in-house hire.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="px-5 py-3 bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors"
            >
              Talk to our agent →
            </Link>
            <a
              href="mailto:hello@agentwerke.com"
              className="px-5 py-3 border border-zinc-300 rounded-md font-medium hover:bg-zinc-50 transition-colors"
            >
              Email us
            </a>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            The agent on this site books real calls, sends real confirmations, and references our real
            knowledge base. Same architecture we ship to clients.
          </p>
        </section>

        {/* Three-up: what we build */}
        <section className="mt-24 grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-sm font-medium text-zinc-900 mb-2">Office Manager Agent</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Inbox triage, calendar coordination, vendor follow-ups, intake routing, weekly reports.
              The boring 70% of an office manager's role.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900 mb-2">Customer-facing Agent</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Answers website questions, qualifies leads, books meetings. Like the one you're talking
              to right now, configured for your business.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900 mb-2">Workflow Automation</div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Multi-step processes that touch your CRM, calendar, email, and accounting. The stuff
              that should just happen and doesn't.
            </p>
          </div>
        </section>

        <div className="mt-24 pt-8 border-t border-zinc-200 text-sm text-zinc-500 flex justify-between">
          <span>Agentwerke · Chapel Hill, NC</span>
          <span>Built on Anthropic Claude</span>
        </div>
      </div>
    </main>
  );
}
