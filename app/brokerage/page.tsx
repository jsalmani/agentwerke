import Link from 'next/link';
import Chat from '@/app/components/Chat';

export const metadata = {
  title: 'Agentwerke for Broker-Dealers — Custom Claude Agents for Independent BDs',
  description:
    'We build Compliance Co-Pilots, Onboarding Accelerators, and Rep Productivity agents for independent broker-dealers. Custom-built on Claude. Live in 8-16 weeks.',
};

export default function BrokerageLandingPage() {
  return (
    <main data-vertical="brokerage" className="min-h-screen bg-paper text-ink">
      {/* ─── Nav ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-rule bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrokerageMark />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[20px] tracking-tight text-ink">Agentwerke</span>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mute pt-0.5">
                For Broker-Dealers
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-7 text-sm text-ink-soft">
            <a href="#engagements" className="hover:text-ink transition">
              Engagements
            </a>
            <a href="#pricing" className="hover:text-ink transition">
              Pricing
            </a>
            <a href="#chat" className="hover:text-ink transition">
              Talk to Avery
            </a>
            <a href="mailto:brokerage@agentwerke.com" className="hover:text-ink transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-9">
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent)] mb-6">
                For Independent Broker-Dealers
              </div>
              <h1 className="font-display font-medium text-[40px] sm:text-[54px] lg:text-[72px] leading-[1.04] tracking-[-0.02em] text-ink">
                Extend your compliance team's capacity{' '}
                <span className="text-[var(--accent)]">3–5×</span>{' '}
                without adding headcount.
              </h1>
              <p className="mt-7 max-w-2xl text-[17px] lg:text-lg text-ink-soft leading-[1.65]">
                We build custom Claude-based agents for the operational and compliance work
                that's drowning your back office. Onboarding, account opening, compliance review
                queue triage, branch audit prep. Built on your written supervisory procedures,
                integrated with the tools you already use, and designed for FINRA defensibility
                from day one.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#chat"
                  className="px-6 py-3 bg-[var(--ink)] text-white rounded-md font-medium text-[15px] hover:opacity-95 transition"
                >
                  Talk to our agent →
                </a>
                <a
                  href="mailto:brokerage@agentwerke.com"
                  className="px-6 py-3 bg-white border border-rule text-ink rounded-md font-medium text-[15px] hover:bg-paper-2 transition"
                >
                  Email us
                </a>
              </div>

              <p className="mt-5 text-sm text-mute max-w-xl leading-relaxed">
                The agent on this site books real calls, sends real confirmations, and references
                our real knowledge base — same architecture we ship to client firms.
              </p>
            </div>

            {/* Editorial pull-figure */}
            <aside className="lg:col-span-3 lg:border-l lg:border-rule lg:pl-8 hidden lg:block">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-mute mb-3">
                Reference figure
              </div>
              <div className="font-display text-[64px] leading-none text-[var(--accent)] mb-3">
                $88k
              </div>
              <p className="text-[14px] text-ink-soft leading-relaxed">
                Year-one cost of the Compliance Co-Pilot — less than the loaded cost of one
                compliance analyst, while extending the entire team's capacity 3–5×.
              </p>
              <a
                href="#pricing"
                className="mt-4 inline-block text-[13px] font-medium text-[var(--accent)] hover:underline"
              >
                See pricing →
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Stack strip ──────────────────────────────────────────────────── */}
      <section className="border-b border-rule bg-paper-2">
        <div className="max-w-6xl mx-auto px-6 py-7 flex flex-wrap items-center gap-x-10 gap-y-3 text-[12px] font-mono tracking-[0.12em] uppercase text-mute">
          <span className="text-ink-soft">Works alongside</span>
          <span>Smarsh</span>
          <span className="text-rule">·</span>
          <span>Global Relay</span>
          <span className="text-rule">·</span>
          <span>Cisco Archiving</span>
          <span className="text-rule">·</span>
          <span>Pershing</span>
          <span className="text-rule">·</span>
          <span>NFS</span>
          <span className="text-rule">·</span>
          <span>SEI</span>
          <span className="text-rule">·</span>
          <span>FINRA Web CRD</span>
        </div>
      </section>

      {/* ─── What we build ────────────────────────────────────────────────── */}
      <section id="engagements" className="bg-white border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-4">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-mute mb-3">
                Engagements
              </div>
              <h2 className="font-display font-medium text-[34px] lg:text-[44px] leading-[1.08] tracking-[-0.015em] text-ink">
                Three productized engagements.
              </h2>
            </div>
            <p className="lg:col-span-7 lg:col-start-6 text-[16px] text-ink-soft leading-[1.7] lg:pt-6">
              Designed around the pain points we hear most often from CCOs and COOs at independent
              BDs. Fixed scope, fixed price, predictable timeline. No "contact us for a quote"
              gating.
            </p>
          </div>

          <div className="border-t border-rule">
            <Engagement
              num="01"
              name="Onboarding Accelerator"
              for_="BDs recruiting 20+ reps per year"
              build="8-week build · 12-month minimum"
              body="The agent walks new reps through document collection, drafts U4s and supporting docs, manages the bridge license workflow, and surfaces gaps for compliance review."
            />
            <Engagement
              num="02"
              name="Compliance Co-Pilot"
              for_="Firms with 50–500 reps where the compliance team is structurally underwater"
              build="12-week build · 12-month minimum"
              body="Pre-screens emails, social posts, marketing materials, OBAs, and gift logs. Drafts complaint acknowledgments and audit response packages. 3–5× the throughput from your existing compliance team."
              featured
            />
            <Engagement
              num="03"
              name="Rep Productivity Suite"
              for_="Growth-mode BDs trying to attract reps from wirehouses with better operational support"
              build="16-week build · 12-month minimum"
              body="New account opening assistant, suitability documentation generator, and Reg BI assistant — all under your CCO's supervision."
            />
          </div>
        </div>
      </section>

      {/* ─── How it fits ──────────────────────────────────────────────────── */}
      <section className="bg-paper-2 border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-2xl mb-12">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-mute mb-3">
              How a Compliance Co-Pilot fits
            </div>
            <h2 className="font-display font-medium text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.015em] text-ink">
              Built around your written supervisory procedures, not around ours.
            </h2>
          </div>

          <ol className="grid md:grid-cols-3 gap-8">
            <Step
              n="01"
              title="WSPs and policy library go in."
              body="We ingest your written supervisory procedures, surveillance lexicons, escalation matrices, and CCO-approved language patterns into the agent's cached context."
            />
            <Step
              n="02"
              title="Agent triages the queue."
              body="Email, social, OBAs, gift logs, marketing materials. The agent flags, drafts a recommended disposition, and shows the WSP citation that supports the call."
            />
            <Step
              n="03"
              title="Your CCO reviews and signs."
              body="Every disposition surfaces to a human reviewer. The agent never finalizes — it accelerates. Defensible by design, with full audit trails on every call."
            />
          </ol>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-white border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 mb-12">
            <div className="lg:col-span-5">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-mute mb-3">
                Pricing
              </div>
              <h2 className="font-display font-medium text-[34px] lg:text-[44px] leading-[1.08] tracking-[-0.015em] text-ink">
                Transparent. Productized.
              </h2>
            </div>
            <p className="lg:col-span-6 lg:col-start-7 text-[16px] text-ink-soft leading-[1.7] lg:pt-4">
              All tiers integrate with your existing archiving (Smarsh, Global Relay, Cisco), CRM,
              compliance management system, and custodian platform. We don't ask you to switch
              tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 border border-rule rounded-md overflow-hidden bg-white divide-y md:divide-y-0 md:divide-x divide-rule">
            <PricingColumn
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
            <PricingColumn
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
            <PricingColumn
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

          <p className="mt-6 text-[13px] text-mute max-w-3xl">
            All engagements include a 12-month minimum term. Setup invoiced 50% on signed SOW,
            50% on go-live. Monthly retainer net-30, first of each month.
          </p>
        </div>
      </section>

      {/* ─── Talk to Avery ────────────────────────────────────────────────── */}
      <section id="chat" className="bg-paper-2 border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 mb-10">
            <div className="lg:col-span-7">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-mute mb-3">
                Talk to Avery
              </div>
              <h2 className="font-display font-medium text-[34px] lg:text-[44px] leading-[1.08] tracking-[-0.015em] text-ink">
                A real Claude-based agent. Same architecture we build for client firms.
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] text-ink-soft leading-[1.7]">
                Ask her anything about how this works, what we charge, or how it fits with your
                WSPs. She can book you a 30-minute call with Jason directly.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[640px] lg:h-[720px]">
              <Chat vertical="brokerage" />
            </div>

            <aside className="space-y-7">
              <SideBlock title="What's actually happening">
                Every message goes to Claude on Anthropic's API. Avery has tools to read Jason's
                calendar, book a confirmed call, and queue a follow-up email. Nothing here is
                mocked — the chat itself is the demo of what we build.
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

              <SideBlock title="Compliance posture">
                <ul className="space-y-2 text-[14px] text-ink-soft">
                  <li>· Avery does not provide regulatory advice</li>
                  <li>· Transcripts retained for supervisory review</li>
                  <li>· No promises about FINRA outcomes</li>
                </ul>
              </SideBlock>

              <SideBlock title="Want one for your firm?">
                Just ask Avery to book you a call. Or email{' '}
                <a
                  className="underline hover:text-ink transition"
                  href="mailto:brokerage@agentwerke.com"
                >
                  brokerage@agentwerke.com
                </a>
                .
              </SideBlock>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-[13px] text-mute">
          <div className="flex items-center gap-3">
            <BrokerageMark small />
            <span>Agentwerke · Chapel Hill, NC · © 2026</span>
          </div>
          <div className="md:col-span-2 leading-relaxed text-[12px] text-mute">
            Agentwerke LLC is a software vendor. We are not a registered broker-dealer, investment
            adviser, or law firm. Nothing on this page constitutes legal, regulatory, or
            compliance advice. All engagements operate under your firm's written supervisory
            procedures and CCO sign-off.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Pieces ───────────────────────────────────────────────────────────── */

function BrokerageMark({ small = false }: { small?: boolean }) {
  const size = small ? 18 : 26;
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect
          x="1"
          y="1"
          width="22"
          height="22"
          rx="2"
          stroke="var(--ink)"
          strokeWidth="1.4"
          fill="white"
        />
        <path d="M5 15.5 L9 8.5 L13 15.5 L17 8.5" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="5" y1="18" x2="19" y2="18" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Engagement({
  num,
  name,
  for_,
  build,
  body,
  featured = false,
}: {
  num: string;
  name: string;
  for_: string;
  build: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <article className="grid md:grid-cols-12 gap-6 py-10 border-b border-rule">
      <div className="md:col-span-2">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent)]">
          {num}
        </div>
      </div>
      <div className="md:col-span-6">
        <h3 className="font-display text-[24px] lg:text-[28px] leading-tight tracking-[-0.005em] text-ink">
          {name}
          {featured && (
            <span className="ml-3 align-middle inline-block px-2 py-0.5 text-[10px] font-mono tracking-[0.14em] uppercase text-[var(--accent)] border border-[var(--accent)] rounded-sm">
              Most common
            </span>
          )}
        </h3>
        <p className="mt-3 text-[15px] text-ink-soft leading-[1.7]">{body}</p>
      </div>
      <div className="md:col-span-4 md:pl-6 md:border-l md:border-rule space-y-3">
        <Detail label="For" value={for_} />
        <Detail label="Cadence" value={build} />
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-mute">{label}</div>
      <div className="text-[14px] text-ink-soft leading-snug mt-0.5">{value}</div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="bg-white border border-rule rounded-md p-6 shadow-card">
      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent)] mb-3">
        Step {n}
      </div>
      <h3 className="font-display text-[20px] leading-tight tracking-[-0.005em] text-ink mb-3">
        {title}
      </h3>
      <p className="text-[14px] text-ink-soft leading-[1.7]">{body}</p>
    </li>
  );
}

function PricingColumn({
  name,
  setup,
  monthly,
  points,
  featured = false,
}: {
  name: string;
  setup: string;
  monthly: string;
  points: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative p-7 ${featured ? 'brass-rule-top bg-paper-2' : 'bg-white'}`}
    >
      {featured && (
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] mb-3">
          Most common
        </div>
      )}
      <div className="font-display text-[20px] tracking-[-0.005em] text-ink mb-5">{name}</div>
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[40px] leading-none text-ink">{setup}</span>
          <span className="text-[13px] text-mute">setup</span>
        </div>
        <div className="mt-1 font-mono text-[13px] text-ink-soft">
          + {monthly} <span className="text-mute">/ month</span>
        </div>
      </div>
      <ul className="space-y-3 text-[14px] text-ink-soft border-t border-rule pt-5">
        {points.map((p, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-[var(--accent)] mt-1">·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-mute mb-3 pb-2 border-b border-rule">
        {title}
      </div>
      <div className="text-[14px] leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}
