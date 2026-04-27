# Avery — Agentwerke's website agent

A real Claude agent that lives on agentwerke.com, answers questions, and books discovery calls. Built on Next.js 15 + Vercel AI SDK 6 + Anthropic Claude. The architecture is the same one we ship to clients — the demo and the product are the same thing.

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
avery-agent/
├── app/
│   ├── api/chat/route.ts        # Main agent endpoint — streamText + tools
│   ├── components/Chat.tsx       # Streaming chat UI with quick-reply pills
│   ├── demo/page.tsx             # /demo page where Avery lives
│   ├── page.tsx                  # Homepage
│   └── layout.tsx, globals.css   # Standard Next.js scaffolding
├── knowledge-base/               # 11 markdown files Avery references
│   ├── 01-services.md
│   ├── 02-pricing.md
│   ├── ... (9 more)
├── lib/
│   ├── system-prompt.ts          # Avery's identity, voice, escalation rules
│   ├── tools.ts                  # 5 tools: getSlots, book, captureLead, handoff
│   ├── calcom.ts                 # Cal.com v2 API client
│   ├── email.ts                  # Resend confirmation + founder notification
│   ├── supabase.ts               # Persistence layer
│   ├── supabase-schema.sql       # Run once in Supabase SQL Editor
│   └── knowledge-base.generated.ts  # AUTO-GENERATED from /knowledge-base
├── scripts/
│   └── build-knowledge-base.ts   # Concatenates KB markdown → TS module
├── evals/
│   └── run-evals.ts              # 25 regression tests — run on every prompt change
└── .env.example                  # All env vars documented
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

This concatenates everything in `knowledge-base/*.md` into `lib/knowledge-base.generated.ts`. Re-run after editing any KB markdown file.

### 7. Run locally

```bash
npm run dev
```

Open http://localhost:3000 (homepage) or http://localhost:3000/demo (chat with Avery directly).

### 8. Run evals

```bash
npm run evals
```

Runs 25 test cases against Avery to catch regressions. Should pass all 25 before deploying.

## Iterating on Avery

### Editing what Avery says

- **Voice, banned words, escalation rules** → edit `knowledge-base/11-voice-meta.md`
- **Pricing** → edit `knowledge-base/02-pricing.md`
- **Services** → edit `knowledge-base/01-services.md`
- **Identity, tool use rules, anti-injection guardrails** → edit `lib/system-prompt.ts`

After any KB edit, re-run `npm run build:kb` (or just `npm run build` which does both).

After any prompt edit, run `npm run evals` to make sure you didn't regress something.

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
