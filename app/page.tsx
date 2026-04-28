import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* ─── Nav ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mark />
            <span className="font-display text-[19px] font-medium tracking-tight text-ink">
              Agentwerke
            </span>
          </Link>
          <nav className="flex items-center gap-7 text-sm text-ink-soft">
            <Link href="/brokerage" className="hover:text-ink transition">
              For Broker-Dealers
            </Link>
            <Link href="/demo" className="hover:text-ink transition">
              Try Avery
            </Link>
            <a href="mailto:hello@agentwerke.com" className="hover:text-ink transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-9">
            <div className="eyebrow eyebrow-accent mb-5">
              <span className="inline-block live-dot w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-2 align-middle" />
              A small AI agency · Chapel Hill, NC
            </div>

            <h1 className="font-display font-medium text-[44px] sm:text-[56px] lg:text-[76px] leading-[1.02] tracking-[-0.02em] text-ink">
              Give your team a Claude agent for the{' '}
              <span className="ink-underline italic">office work</span> draining everyone.
            </h1>

            <p className="mt-7 max-w-2xl text-lg lg:text-xl text-ink-soft leading-relaxed">
              We build production-grade Claude agents that extend what your existing team can take
              on — office manager work, customer intake, scheduling, follow-ups. Live in two weeks.
              $12,000 setup plus $1,000/month. Same humans, with capacity they didn't have before.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="px-5 py-3 bg-[var(--accent)] text-white rounded-md font-medium text-[15px] hover:opacity-95 transition shadow-warm"
              >
                Talk to our agent →
              </Link>
              <a
                href="mailto:hello@agentwerke.com"
                className="px-5 py-3 bg-white border border-rule text-ink rounded-md font-medium text-[15px] hover:bg-paper-2 transition"
              >
                Email us
              </a>
            </div>

            <p className="mt-6 font-mono text-[12px] tracking-[0.16em] uppercase text-[var(--accent)]">
              Same humans. New tools. Better leverage.
            </p>

            <p className="mt-5 text-sm text-mute max-w-xl leading-relaxed">
              The agent on this site books real calls, sends real confirmations, and references
              our real knowledge base. Same architecture we ship to clients.
            </p>
          </div>

          {/* Side-stamped detail block — small specimen card */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="bg-card border border-rule rounded-lg p-5 shadow-warm">
              <div className="eyebrow mb-3">Spec sheet</div>
              <dl className="space-y-3 text-sm">
                <Row k="Build window" v="2 weeks" />
                <Row k="Setup" v="$12,000" />
                <Row k="Monthly" v="$1,000" />
                <Row k="Stack" v="Claude · Next.js" />
                <Row k="Hosting" v="Vercel + Supabase" />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ribbon ───────────────────────────────────────────────────────── */}
      <Ribbon />

      {/* ─── What we build ────────────────────────────────────────────────── */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow mb-4">What we build</div>
            <h2 className="font-display font-medium text-[34px] lg:text-[44px] leading-[1.08] tracking-[-0.015em] text-ink">
              Three patterns that give your team back the boring 70% of small-business operations.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            <ProductCard
              num="01"
              title="Office Manager Agent"
              body="Inbox triage, calendar coordination, vendor follow-ups, intake routing, weekly reports. Your team keeps the relationships and the judgment; the agent does the rest."
              meta="Most common · 2-week build"
            />
            <ProductCard
              num="02"
              title="Customer-facing Agent"
              body="Answers website questions, qualifies leads, books meetings. Like the one you're talking to right now, configured for your business."
              meta="Like Avery on this site"
            />
            <ProductCard
              num="03"
              title="Workflow Automation"
              body="Multi-step processes that touch your CRM, calendar, email, and accounting. The stuff that should just happen and doesn't."
              meta="Custom-scoped · quote on call"
            />
          </div>
        </div>
      </section>

      {/* ─── Editorial pull-quote → demo CTA ──────────────────────────────── */}
      <section className="border-t border-rule bg-paper-2">
        <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
          <div className="eyebrow mb-6">Live demo</div>
          <p className="font-display text-[28px] sm:text-[34px] lg:text-[44px] leading-[1.15] tracking-[-0.01em] text-ink max-w-4xl">
            The agent on this site is real. It books real calls, sends real confirmations, and
            references our real knowledge base — same architecture we ship to clients.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/demo"
              className="px-5 py-3 bg-ink text-paper rounded-md font-medium text-[15px] hover:opacity-90 transition"
            >
              Try Avery →
            </Link>
            <span className="text-sm text-mute">No signup. No demo form. Just chat.</span>
          </div>
        </div>
      </section>

      {/* ─── Two ways we work ─────────────────────────────────────────────── */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-2xl mb-12">
            <div className="eyebrow mb-4">Where we work</div>
            <h2 className="font-display font-medium text-[34px] lg:text-[44px] leading-[1.08] tracking-[-0.015em] text-ink">
              Two tracks. Same engineering bench.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <TrackCard
              eyebrow="Small business"
              title="The default Agentwerke engagement."
              body="Office Manager and customer-facing agents for owner-operated businesses with 5–50 staff. Productized scope, $12K + $1K/mo, two-week build."
              cta="Talk to Avery"
              href="/demo"
            />
            <TrackCard
              eyebrow="Independent broker-dealers"
              title="A vertical we know in detail."
              body="Compliance Co-Pilots, onboarding, and rep productivity for FINRA-regulated firms. Same architecture, custom-built around your written supervisory procedures."
              cta="See the BD page"
              href="/brokerage"
            />
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-mute">
          <div className="flex items-center gap-2">
            <Mark small />
            <span>Agentwerke · Chapel Hill, NC · © 2026</span>
          </div>
          <div className="font-mono text-[11px] tracking-wide">
            BUILT ON ANTHROPIC CLAUDE
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Pieces ───────────────────────────────────────────────────────────── */

function Mark({ small = false }: { small?: boolean }) {
  const size = small ? 16 : 22;
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="var(--ink)" />
        <path
          d="M7 16.5 L12 7 L17 16.5"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 13.5 H14.8"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-rule pb-2 last:border-b-0 last:pb-0">
      <dt className="text-mute">{k}</dt>
      <dd className="text-ink font-medium font-mono text-[13px]">{v}</dd>
    </div>
  );
}

function ProductCard({
  num,
  title,
  body,
  meta,
}: {
  num: string;
  title: string;
  body: string;
  meta: string;
}) {
  return (
    <article className="relative">
      <div className="font-mono text-[11px] tracking-wider text-accent mb-3">{num}</div>
      <h3 className="font-display text-[22px] leading-tight tracking-[-0.005em] text-ink mb-3">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-ink-soft mb-5">{body}</p>
      <div className="text-xs text-mute pt-4 border-t border-rule">{meta}</div>
    </article>
  );
}

function TrackCard({
  eyebrow,
  title,
  body,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block bg-card border border-rule rounded-lg p-7 hover:shadow-warm transition"
    >
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h3 className="font-display text-[24px] leading-tight tracking-[-0.005em] text-ink mb-3">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-ink-soft mb-5">{body}</p>
      <div className="text-sm font-medium text-accent">
        {cta} <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}

function Ribbon() {
  // CSS-driven marquee. The track is duplicated so the loop reads seamlessly.
  const items = [
    'Live in two weeks',
    '$12,000 setup',
    '$1,000 / month',
    'Two-week build window',
    'Real Claude agents',
    'Same stack we ship',
    'No demo forms',
    'Chapel Hill, NC',
  ];
  const track = [...items, ...items];

  return (
    <div className="border-y border-rule bg-[var(--ink)] text-paper overflow-hidden">
      <div className="ribbon-track flex whitespace-nowrap py-3">
        {track.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center px-6 text-[12px] font-mono tracking-[0.14em] uppercase"
          >
            <span className="text-[var(--accent)] mr-3">✱</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
