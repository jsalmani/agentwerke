import Link from 'next/link';
import Chat from '@/app/components/Chat';

export const metadata = {
  title: 'Agentwerke for Broker-Dealers — Custom Claude Agents for Independent BDs',
  description:
    'We build Compliance Co-Pilots, Onboarding Accelerators, and Rep Productivity agents for independent broker-dealers. Custom-built on Claude. Live in 8-16 weeks.',
};

export default function BrokerageLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Agentwerke
          <span className="ml-2 text-sm font-normal text-zinc-500">for Broker-Dealers</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <a href="#tiers" className="hover:text-zinc-900">
            Pricing
          </a>
          <a href="#chat" className="hover:text-zinc-900">
            Talk to Avery
          </a>
          <a href="mailto:brokerage@agentwerke.com" className="hover:text-zinc-900">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">
            For independent broker-dealers
          </div>
          <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.05]">
            Extend your compliance team's capacity 3-5x without adding headcount.
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-zinc-600 leading-relaxed">
            We build custom Claude-based agents for the operational and compliance work that's
            drowning your back office. Onboarding, account opening, compliance review queue triage,
            branch audit prep. Built on your written supervisory procedures, integrated with the
            tools you already use, and designed for FINRA defensibility from day one.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#chat"
              className="px-5 py-3 bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors"
            >
              Talk to our agent →
            </a>
            <a
              href="mailto:brokerage@agentwerke.com"
              className="px-5 py-3 border border-zinc-300 rounded-md font-medium hover:bg-zinc-50 transition-colors"
            >
              Email us
            </a>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            The agent on this site books real calls, sends real confirmations, and references our
            real knowledge base. Same architecture we ship to client firms.
          </p>
        </div>
      </section>

      {/* What we build */}
      <section className="border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-2">
            What we build
          </h2>
          <p className="text-zinc-600 mb-12 max-w-2xl">
            Three productized engagements designed around the pain points we hear most often from
            CCOs and COOs at independent BDs.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-medium text-zinc-900 mb-2">Onboarding Accelerator</div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                For BDs recruiting 20+ reps per year. The agent walks new reps through document
                collection, drafts U4s and supporting docs, manages the bridge license workflow,
                and surfaces gaps for compliance review.
              </p>
              <p className="text-xs text-zinc-500">8-week build · 12-month minimum</p>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-900 mb-2">Compliance Co-Pilot</div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                Our most common engagement. Pre-screens emails, social posts, marketing materials,
                OBAs, and gift logs. Drafts complaint acknowledgments and audit response packages.
                3-5x the throughput from your existing compliance team.
              </p>
              <p className="text-xs text-zinc-500">12-week build · 12-month minimum</p>
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-900 mb-2">Rep Productivity Suite</div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                For growth-mode BDs trying to attract reps from wirehouses with better operational
                support. New account opening assistant, suitability documentation generator, and
                Reg BI assistant — all under your CCO's supervision.
              </p>
              <p className="text-xs text-zinc-500">16-week build · 12-month minimum</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tiers" className="border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-2">Pricing</h2>
          <p className="text-zinc-600 mb-12 max-w-2xl">
            Transparent and productized. Less than the loaded cost of one compliance analyst.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Onboarding Accelerator"
              setup="$25,000"
              monthly="$2,000"
              points={[
                'New rep onboarding agent',
                'Branch office paperwork automation',
                'Up to 5,000 interactions/month',
                'Monthly optimization session',
              ]}
            />
            <PricingCard
              name="Compliance Co-Pilot"
              setup="$40,000"
              monthly="$4,000"
              featured
              points={[
                'Compliance review queue triage',
                'Branch audit prep',
                'Customer complaint intake',
                'Up to 25,000 review items/month',
                'Quarterly improvement sprint',
              ]}
            />
            <PricingCard
              name="Rep Productivity Suite"
              setup="$60,000"
              monthly="$6,000"
              points={[
                'New account opening assistant',
                'Suitability documentation',
                'Reg BI assistant + CE tracker',
                'Unlimited interactions',
                'Priority support, 4-hour response',
              ]}
            />
          </div>

          <p className="mt-8 text-sm text-zinc-500 max-w-2xl">
            All tiers integrate with your existing archiving (Smarsh, Global Relay, Cisco), CRM,
            compliance management, and custodian platform. We don't ask you to switch tools.
          </p>
        </div>
      </section>

      {/* Talk to Avery */}
      <section id="chat" className="border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-2">
            Talk to Avery
          </h2>
          <p className="text-zinc-600 mb-10 max-w-2xl">
            Avery is a real Claude-based agent — same architecture we build for client firms. Ask
            her anything about how this works, what we charge, or how it fits with your WSPs. She
            can book you a 30-minute call with Jason directly.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[700px]">
              <Chat vertical="brokerage" />
            </div>

            <aside className="space-y-6 text-sm text-zinc-600">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                  What's actually happening
                </h3>
                <p className="leading-relaxed">
                  Every message goes to Claude on Anthropic's API. Avery has tools to read Jason's
                  calendar, book a confirmed call, and queue a follow-up email. Nothing here is
                  mocked — the chat itself is the demo of what we build.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                  The stack
                </h3>
                <ul className="space-y-1.5">
                  <li>· Claude Haiku 4.5 + Sonnet 4.6</li>
                  <li>· Vercel AI SDK 6 · Next.js 15</li>
                  <li>· Cal.com (booking) · Resend (email)</li>
                  <li>· Supabase (audit + persistence)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-2">
                  Want one for your firm?
                </h3>
                <p className="leading-relaxed">
                  Just ask Avery to book you a call. Or email{' '}
                  <a
                    className="underline hover:text-zinc-900"
                    href="mailto:brokerage@agentwerke.com"
                  >
                    brokerage@agentwerke.com
                  </a>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-zinc-500 flex justify-between">
          <span>Agentwerke · Chapel Hill, NC</span>
          <span>Built on Anthropic Claude</span>
        </div>
      </footer>
    </main>
  );
}

interface PricingCardProps {
  name: string;
  setup: string;
  monthly: string;
  points: string[];
  featured?: boolean;
}

function PricingCard({ name, setup, monthly, points, featured }: PricingCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        featured ? 'border-zinc-900 bg-white shadow-md' : 'border-zinc-200 bg-white'
      }`}
    >
      {featured && (
        <div className="text-xs font-medium uppercase tracking-wider text-zinc-900 mb-3">
          Most common
        </div>
      )}
      <div className="font-medium text-zinc-900 mb-1">{name}</div>
      <div className="mt-2 mb-4">
        <span className="text-2xl font-semibold text-zinc-900">{setup}</span>
        <span className="text-zinc-500"> setup</span>
        <div className="text-sm text-zinc-600">
          + {monthly} <span className="text-zinc-500">monthly</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm text-zinc-600">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-zinc-400">·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
