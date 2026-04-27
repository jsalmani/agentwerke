# Our Technology Stack

We're transparent about how we build because the tools matter. If you're a technical buyer, here's exactly what's under the hood of every Agentwerke agent.

## Models

- **Claude Sonnet 4.6** — our default for complex reasoning, multi-step workflows, and any agent that needs to handle ambiguous or novel input. From Anthropic.
- **Claude Haiku 4.5** — our workhorse for high-volume, lower-complexity workflows where latency and cost matter. Same Anthropic family, same safety properties, much faster.
- **Claude Opus 4.7** — used selectively for the hardest reasoning tasks (e.g., complex document analysis, multi-document synthesis). Not the default because of cost.

We do not fine-tune Anthropic's models. We use prompt engineering, structured tool definitions, and contextual retrieval to specialize the agent's behavior — and we use Anthropic's prompt caching to keep costs low.

## Application stack

- **Next.js 15** with the App Router on **Vercel Pro** for the agent's frontend and API.
- **Vercel AI SDK 6** for the agent loop, streaming, and tool orchestration. This is the same SDK Vercel uses for its own AI features.
- **TypeScript** end to end.
- **Anthropic's TypeScript SDK** for direct API access where we need fine-grained control beyond what the AI SDK provides.

## Tool integration

- **Model Context Protocol (MCP)** for connecting agents to client systems where MCP servers exist. We're early adopters of the Anthropic-led MCP standard because it's becoming the universal connector for agent tools.
- **Direct API integration** for systems without MCP servers — Cal.com, Resend, Supabase, HubSpot, Google Workspace, Microsoft 365, ServiceTitan, Clio, and others.
- **OAuth 2.0** for all client system access, with least-privilege scopes.

## Data and persistence

- **Supabase Postgres** for conversation logs, audit trails, and per-client knowledge bases. Encrypted at rest, US region.
- **pgvector** for embedding-based retrieval when knowledge bases exceed the size that fits efficiently in Claude's context window. For most clients, we use Claude's prompt caching to keep the entire knowledge base in the prompt — it's faster, simpler, and produces better answers than RAG for documents under ~150,000 tokens.

## Security and operations

- **Doppler** for secrets management (per-client credential isolation).
- **GitHub** for code, with branch protection and required reviews on every change.
- **Promptfoo** for evaluation harnesses. Every agent has a regression suite that runs on every prompt change.
- **Langfuse** for observability — full prompt and response traces, latency monitoring, cost tracking.

## Why this stack

Three reasons: (1) it's what we'd build for a Fortune 500 client; small businesses deserve the same engineering rigor. (2) Every component is best-in-class for its job, not "good enough." (3) Nothing in this stack creates lock-in we can't reverse — your agent is portable across model providers if Anthropic ever fails to deliver, and your data is in standard formats we can hand back at any time.
