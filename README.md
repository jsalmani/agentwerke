# Avery — Agentwerke's website agent

A real Claude agent that lives on agentwerke.com, answers questions, and books discovery calls. Built on Next.js 15 + Vercel AI SDK 6 + Anthropic Claude. The architecture is the same one we ship to clients — the demo and the product are the same thing.

Avery is **multi-vertical**: she runs in two modes (parent SMB agency, and broker-dealer) off a single deployment. Each vertical has its own knowledge base and its own persona overlay, but shares the same tools, audit trail, and infrastructure. Each surface has a distinct visual identity — see `DESIGN-PLAN.md` and `DESIGN-NOTES.md`.

## Stack at a glance

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind | Fast, opinionated, deploys cleanly to Vercel |
| Agent loop | Vercel AI SDK 6 + `@ai-sdk/anthropic` | Best-in-class agent SDK for web chat (December 2025) |
| Models | Claude Haiku 4.5 (default), Sonnet 4.6 (escalation) | Haiku is 4-5× faster TTFT, 1/3 the cost; Sonnet for complex reasoning |
| Knowledge base | Stuffed in cached system prompt | At ~8K tokens, RAG is overkill — caching is faster, simpler, more accurate |
| Booking | Cal.com v2 API | Free Individual tier, modern API, "tech-savvy" signal |
| Email | Resend + React Email | Confirmation + founder notifications, free tier sufficient |
| Persistence | Supabase Postgres | Free tier, good enough until $30K MRR; pgvector ready when we add RAG |
| Hosting | Vercel Pro | Streaming SSE built-in, zero cold start with Fluid Compute |

## What's in this repo

```
agentwerke/
├── app/
│   ├── api/chat/route.ts                 # Main agent endpoint — streamText + tools
│   ├── components/Chat.tsx               # Streaming chat UI, theme-aware (parent | brokerage)
│   ├── page.tsx                          # / homepage (parent persona)
│   ├── demo/page.tsx                     # /demo — chat with parent Avery
│   ├── brokerage/page.tsx                # /brokerage — broker-dealer landing + chat
│   ├── layout.tsx                        # Loads Inter, Fraunces, Source Serif 4, JetBrains Mono
│   └── globals.css                       # CSS variable theme tokens (parent + brokerage)
├── knowledge-base/                       # 11 markdown files — parent (SMB) Avery
│   ├── 01-services.md
│   ├── 02-pricing.md
│   ├── ... (9 more)
├── knowledge-base-brokerage/             # 11 markdown files — broker-dealer Avery
│   ├── 01-services.md
│   ├── 02-pricing.md
│   ├── ... (9 more)
├── lib/
│   ├── system-prompt.ts                  # Vertical-aware: buildSystemMessage('parent' | 'brokerage')
│   ├── tools.ts                          # Shared tools: getSlots, book, captureLead, handoff
│   ├── calcom.ts                         # Cal.com v2 API client
│   ├── email.ts                          # Resend confirmation + founder notification
│   ├── supabase.ts                       # Persistence layer (sessions, messages, tool_calls, leads)
│   ├── supabase-schema.sql               # Run once in Supabase SQL Editor
│   ├── knowledge-base.generated.ts       # AUTO-GENERATED from /knowledge-base
│   └── knowledge-base-brokerage.generated.ts  # AUTO-GENERATED from /knowledge-base-brokerage
├── scripts/
│   └── build-knowledge-base.ts           # Concatenates BOTH KB folders → TS modules
├── evals/
│   └── run-evals.ts                      # Regression tests — parent + brokerage cases
├── DESIGN-PLAN.md                        # Type, palette, layout direction per page
├── DESIGN-NOTES.md                       # Choices, struggles, things to reconsider
├── CODE-AUDIT.md                         # Audit of lib/* — findings only, no modifications
└── .env.example                          # All env vars documented
```

## First-time setup

### 1. Get your accounts

You need accounts at: [Anthropic Console](https://console.anthropic.com), [Cal.com](https://cal.com), [Resend](https://resend.com), [Supabase](https://supabase.com), and [Vercel](https://vercel.com). All have free tiers sufficient to develop and demo.

### 2. Clone and install

```bash
git clone <your-repo-url> avery-agent
cd avery-agent
npm install
cp .env.example .env.local
```

Fill in `.env.local` with real values from each service. The file documents what each variable is and where to find it.

### 3. Set up Supabase

In the [Supabase dashboard](https://supabase.com/dashboard), create a project, then go to **Database → SQL Editor** and run the contents of `lib/supabase-schema.sql`. This creates the four tables (`sessions`, `messages`, `tool_calls`, `leads`) plus a convenience view (`pipeline`).

Grab your project URL and **service role key** from **Project Settings → API**. Service role key goes in `SUPABASE_SERVICE_ROLE_KEY` — never expose this to the client.

### 4. Set up Cal.com

In Cal.com, create a 30-minute event type called "Discovery Call" (or whatever you prefer). Note the **slug** (in the URL: `cal.com/yourname/discovery-call`). To find the **event type ID** (we need this for the booking API), go to **Settings → Developer → API Keys**, create a key, then run:

```bash
curl -H "Authorization: Bearer YOUR_KEY" -H "cal-api-version: 2024-08-13" \
  https://api.cal.com/v2/event-types
```

Find your event type in the response and copy its `id` to `CALCOM_EVENT_TYPE_ID`.

### 5. Set up Resend

Add your sending domain in Resend (e.g., `agentwerke.com`). Resend gives you DNS records — add them in your registrar. Once verified, your `FROM_EMAIL` should be `something@agentwerke.com`. For local testing, you can also use `onboarding@resend.dev` as the from address — those emails only deliver to the email address you signed up with, but it lets you test without DNS.

### 6. Build the knowledge base

```bash
npm run build:kb
```

This concatenates **both** knowledge bases:
- `knowledge-base/*.md` → `lib/knowledge-base.generated.ts` (parent SMB Avery)
- `knowledge-base-brokerage/*.md` → `lib/knowledge-base-brokerage.generated.ts` (broker-dealer Avery)

Re-run after editing any KB markdown file in either folder.

### 7. Run locally

```bash
npm run dev
```

Three pages to walk through:
- http://localhost:3000 — parent SMB homepage
- http://localhost:3000/demo — chat with parent Avery
- http://localhost:3000/brokerage — broker-dealer landing + chat with brokerage Avery

The chat surface is the same React component on both; the persona, knowledge base, and visual theme are switched by the `vertical` prop on `<Chat />` and the `data-vertical="brokerage"` attribute on `<main>` (which swaps the CSS-variable palette).

### 8. Run evals

```bash
npm run evals
```

Regression tests against Avery for both verticals. Each test is tagged with a category and (optionally) a `vertical` of `'parent'` or `'brokerage'`. Brokerage tests verify FINRA vocabulary is used correctly, no compliance-outcome promises are made, regulatory/investment advice is refused, and brokerage-specific banned marketing words ("transform", "revolutionize", "disrupt") never appear.

Should pass all tests before deploying.

## Multi-vertical architecture — how it actually works

### One agent, two personas

`lib/system-prompt.ts` exports `buildSystemMessage(vertical: 'parent' | 'brokerage')`. The prompt is composed from:

| Layer | Shared? | What it covers |
|---|---|---|
| Identity, voice, tool-use rules, anti-injection guardrails, booking flow | Shared | Same across verticals |
| `VERTICAL_DESCRIPTIONS` | Per-vertical | One-paragraph description of the business |
| `VERTICAL_AUDIENCE` | Per-vertical | Who Avery is talking to (SMB owner vs. CCO/COO at a BD) |
| `VERTICAL_SPECIFIC_RULES` | Per-vertical | Brokerage adds FINRA vocabulary, no compliance-outcome promises, no regulatory advice, no trade routing |
| `VERTICAL_KB` | Per-vertical | The full markdown knowledge base for that vertical |

### Routing the right persona

The chat client sends `vertical: 'parent' | 'brokerage'` on every request (`app/components/Chat.tsx`, `prepareSendMessagesRequest`). The server-side `app/api/chat/route.ts` reads it, calls `buildSystemMessage(vertical)`, and streams a response from Claude Haiku 4.5 (or Sonnet 4.6 on escalation). All four tools (`getAvailableSlots`, `bookDiscoveryCall`, `captureLead`, `handoffToHuman`) are shared — there's no per-vertical tool divergence yet.

### Visual identity

The two verticals are visually distinct on purpose:
- **Parent** uses Fraunces (display) + Inter (body), warm umber accent (#C2410C) on a paper-toned background, soft warm shadows, rounded corners. Editorial / approachable register.
- **Brokerage** uses Source Serif 4 (display) + Inter (body), navy ink (#0B1B2E) with a brass accent (#8C6B2B), hairline-driven layout, tighter corners. Institutional / WSJ register.

Both palettes live as CSS variables in `app/globals.css`. The brokerage palette overrides the parent default whenever the page's `<main>` carries `data-vertical="brokerage"`. The same `<Chat />` component reads those variables — no component-level branching beyond a few rounded-vs-square corner tweaks.

See `DESIGN-PLAN.md` for the full design rationale and `DESIGN-NOTES.md` for the retrospective.

## Iterating on Avery

### Editing what Avery says

- **Voice, banned words, escalation rules (parent)** → edit `knowledge-base/11-voice-meta.md`
- **Voice, banned words, escalation rules (brokerage)** → edit `knowledge-base-brokerage/11-voice-meta.md`
- **Parent pricing** → `knowledge-base/02-pricing.md`
- **Brokerage pricing** → `knowledge-base-brokerage/02-pricing.md`
- **Identity, tool-use rules, vertical-specific overlays, anti-injection guardrails** → `lib/system-prompt.ts`

After any KB edit, re-run `npm run build:kb` (or just `npm run build` which does both).

After any prompt edit, run `npm run evals` to make sure neither persona regressed.

### Adding a new vertical

1. Create `knowledge-base-<vertical>/` with the same 11-file structure (or whatever subset makes sense).
2. Update `scripts/build-knowledge-base.ts` to emit a `lib/knowledge-base-<vertical>.generated.ts`.
3. Add the new vertical to the `Vertical` union, `VERTICAL_DESCRIPTIONS`, `VERTICAL_AUDIENCE`, `VERTICAL_SPECIFIC_RULES`, and `VERTICAL_KB` in `lib/system-prompt.ts`.
4. Add a `data-vertical="<vertical>"` palette block in `app/globals.css` if you want a distinct visual identity.
5. Create a landing page at `app/<vertical>/page.tsx` that renders `<Chat vertical="<vertical>" />`.
6. Add eval cases tagged with `vertical: '<vertical>'` to `evals/run-evals.ts`.

### Adding a new tool

1. Add the tool definition in `lib/tools.ts` (Zod schema + execute fn)
2. Update Avery's system prompt in `lib/system-prompt.ts` to describe when to use it
3. Add eval cases for the new tool in `evals/run-evals.ts`

### Switching models

Set `ANTHROPIC_MODEL` env var. Default is `claude-haiku-4-5`. Switch to `claude-sonnet-4-6` for higher reasoning quality at higher cost. Switch to `claude-opus-4-7` only if you really need it — it's expensive.

## Deploying

### To Vercel

```bash
npm install -g vercel
vercel login
vercel link
vercel env add  # add each variable from .env.local
vercel --prod
```

In the Vercel dashboard, make sure you're on **Pro** ($20/mo) — Hobby tier is non-commercial and Vercel will eventually flag a customer-facing agent as commercial use.

### Domain

Once deployed, point your domain in Vercel under **Project Settings → Domains**. SSL is automatic.

## Costs

At ~500 conversations/month:

| Item | Cost |
|---|---|
| Claude Haiku 4.5 (with 1h cache) | ~$20/mo |
| Vercel Pro | $20/mo |
| Supabase | $0 (free tier sufficient) → $25/mo when persistent storage exceeds free |
| Cal.com Individual | $0 |
| Resend | $0 (3K emails/mo free) |
| Domain | ~$15/yr |
| **Total** | **~$40-65/mo** |

One signed Office Manager Agent client at $12K + $1K/mo pays for ~150 months of stack.

## Operational notes

### Prompt caching

The system prompt + KB block is marked `cacheControl: { type: 'ephemeral', ttl: '1h' }`. **Always pass `ttl: '1h'` explicitly** — Anthropic silently reverted the default to 5-min in March 2026 (see GitHub issue anthropics/claude-code#46829), and a stale cache TTL of 5 minutes will quietly inflate your API bill ~5×.

### Why not RAG for the knowledge base?

At ~8K tokens, the entire KB fits in a cached prefix. Cache reads are 90% off; cached prefill is ~50ms vs ~800ms cold. RAG would add a vector DB, embedding pipeline, chunking strategy, and reranker — for worse latency, worse answers (lost-in-the-middle, chunking errors), and the same cost order of magnitude. Anthropic's own contextual-retrieval guidance: if your KB is under 200K tokens, just put it in the prompt. We'll revisit this if our KB grows past ~150K tokens or our conversation volume exceeds ~100K/month.

### Why not the Claude Agent SDK?

The Claude Agent SDK is purpose-built for autonomous coding/computer-use agents — it ships with Read/Write/Bash/Grep/WebSearch tools that we'd have to explicitly disable for a customer-facing chat. Vercel AI SDK 6 is purpose-built for web chat (`streamText` with tools, `useChat` React hook, MCP support, native SSE streaming). For Avery, AI SDK 6 is the right tool for the job.

### Tenant isolation (when you build agents for clients)

Every client gets their own `client_id` namespace, encrypted OAuth tokens, isolated Anthropic API key (via Anthropic Workspaces for spend tracking), and CI tests verifying client A's agent cannot read client B's data. **No cross-client RAG.** This pattern is described in `lib/system-prompt.ts` for Avery (single-tenant), but when you fork this repo for a client, layer in `client_id` everywhere.

### Prompt injection defense

Avery is read-only with respect to external content (no email reading, no web browsing). When you build agents that DO read external content (an Office Manager Agent reading client emails), implement the defenses from the playbook: privilege separation (untrusted email → summarizer with no tools → trusted summary → decision-maker with tools), domain allowlists for outbound, output filters for known exfil patterns, draft-only mode for external comms.

## Brand transition

The string `Agentwerke` appears in two places that matter:

1. `.env.local` — `NEXT_PUBLIC_AGENCY_NAME` and `FROM_EMAIL`
2. The KB markdown files — services, pricing, etc., which casually reference "Agentwerke"

When you rebrand, update env vars (instant) and run a find-replace across `knowledge-base/*.md` (5 minutes), then `npm run build:kb && npm run evals`. The system prompt (`lib/system-prompt.ts`) reads agency name from env vars, so it updates automatically.

## License

Proprietary. © Agentwerke 2026. Internal use only.
