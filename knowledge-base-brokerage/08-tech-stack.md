# Our Technology Stack

We're transparent about how we build because broker-dealer buyers — especially CCOs and CTOs — need to defend the architectural choice in front of regulators and IT review boards.

## Models

- **Claude Sonnet 4.6** — our default for compliance review reasoning, OBA disclosure analysis, suitability narrative generation, and any agent function that requires careful policy application
- **Claude Haiku 4.5** — used for high-volume triage where latency matters (e.g., first-pass email classification, queue routing)
- **Claude Opus 4.7** — selectively used for complex multi-document analysis (e.g., synthesizing a rep's full historical activity for a focused review)

We do not fine-tune Anthropic's models on client data. We use prompt engineering, structured tool definitions, and policy-grounded retrieval to specialize each agent's behavior — and we use Anthropic's prompt caching to keep costs predictable.

## Application stack

- **Next.js 15** with the App Router on **Vercel Pro** for the agent's frontend and API
- **Vercel AI SDK 6** for the agent loop, streaming, and tool orchestration — the same SDK Vercel uses for its own AI features
- **TypeScript** end to end
- **Anthropic's TypeScript SDK** for direct API access where we need fine-grained control beyond what the AI SDK provides

## Tool integration

- **Model Context Protocol (MCP)** for connecting to client systems where MCP servers exist
- **Direct API integration** for systems without MCP — Smarsh, Global Relay, RegEd, ComplySci, FINRA Web CRD, custodian platforms (Pershing, NFS, SEI), and any firm-specific tooling
- **OAuth 2.0** for all client-system access with least-privilege scopes
- **Read-only by default** for any system that holds regulated data; write access is opt-in, scoped, and gated by approval workflows

## Data and persistence

- **Supabase Postgres** for conversation logs, audit trails, and per-client knowledge bases. Encrypted at rest, US region. SOC 2 Type II.
- **Per-client tenancy with logical isolation.** No agent for any client can read data from another client.
- **WORM-compatible export** to your archiving vendor in formats compatible with SEC 17a-4 retention requirements

## Security and operations

- **Doppler** for secrets management with per-client credential isolation
- **GitHub** for code, with branch protection, required reviews, and signed commits
- **Promptfoo + custom eval harness** for regression testing — every agent has a test suite that runs on every prompt change. Failing tests block the deploy.
- **Langfuse** for observability — full prompt and response traces, latency monitoring, cost tracking, all reviewable by your CCO

## Why this stack

Three reasons matter for BD buyers: (1) it's what we'd build for a Fortune 500 client; broker-dealers deserve the same engineering rigor and we don't take shortcuts. (2) Every component is best-in-class for its job. (3) Nothing in this stack creates lock-in we can't reverse — your agent is portable across model providers if Anthropic ever fails to deliver, and your data is in standard formats we can hand back to you at any time.

## Things we don't use

We don't build on no-code platforms (Voiceflow, Chatbase, Lovable). They limit our ability to enforce the approval gates and audit logging that regulated work requires. We don't fine-tune models on client data. We don't aggregate data across clients. We don't run agents in environments without comprehensive logging.
