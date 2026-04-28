# Security and Data Handling

Agentwerke takes data handling seriously because broker-dealer clients trust us with regulated data — customer PII, supervisory records, and books and records subject to SEC Rule 17a-4 and FINRA Rule 4511. This document describes our current posture and roadmap.

## Where your data goes

When your agent is running, data flows through three categories of systems:

1. **Anthropic's Claude API.** The agent's reasoning happens here. Anthropic does not retain prompts or outputs by default for paid commercial API use, and your data is not used to train Anthropic's models. Anthropic operates under SOC 2 Type II.
2. **The integrations you authorize.** Your archiving vendor (Smarsh, Global Relay, etc.), CRM, compliance management system, and custodian platform. The agent reads from and writes to these via OAuth tokens you grant. We don't see your raw account credentials.
3. **Our own infrastructure.** We store conversation logs, tool-call audit trails, and operational metadata in Postgres on Supabase (US region, encrypted at rest). We retain this data for 12 months for debugging and improvement, then delete. Your firm gets read-only export access on demand.

## What we don't do with your data

- We do not sell, rent, or share your data with any third party.
- We do not use your data to train any AI models — ours or anyone else's.
- We do not aggregate your data with other clients' data for any purpose, including analytics.
- We do not access your data outside of building, debugging, and improving your specific agent.

## Books and records compliance

Every agent interaction is logged in a format compatible with SEC Rule 17a-4 and FINRA Rule 4511 retention requirements:

- Immutable timestamps
- Full conversation content (input, agent reasoning, tool calls, output)
- Human approver identification on every regulated output
- Chain-of-custody for every action that affected a record

We export this in WORM-compatible formats to your archiving vendor's intake pipeline. The agent's activity becomes part of your firm's books and records as a matter of design, not afterthought.

## Access and tenant isolation

- Each client's data is stored in a logically isolated namespace. The agent for Firm A cannot read data from Firm B, by design.
- API keys are per-client. Anthropic Workspaces gives us spend isolation and key isolation across clients.
- OAuth tokens for client systems are encrypted at rest using envelope encryption. Data encryption keys live in the database; key encryption keys live in a separate secrets manager.
- Every read, draft, and approval by the agent is logged with timestamp, action type, target, and content hash. Logs are immutable and retained for one year (or longer per client policy).

## OAuth scopes — least privilege

We use the minimum OAuth scopes necessary for each agent function. Examples:

- **Smarsh / Global Relay:** read-only access to specified message channels, no write access
- **Microsoft Graph:** `Mail.Read`, `Mail.Send` (send only with explicit approval gate), `Calendars.ReadWrite`
- **CRM:** read access to records the agent needs to reason about; write access scoped to specific objects
- **Custodian platforms (Pershing, NFS, SEI):** read-only for account information; no transactional access ever

We document scopes in the Agent Brief and they're reviewed by your CCO before activation.

## Subprocessors

Our subprocessors as of April 2026:

- **Anthropic** (Claude API) — SOC 2 Type II
- **Vercel** (application hosting, US) — SOC 2 Type II
- **Supabase** (managed Postgres, US) — SOC 2 Type II
- **Cal.com** (booking infrastructure)
- **Resend** (transactional email)
- **Doppler** (secrets management) — SOC 2 Type II

We provide 30 days' notice before adding a new subprocessor that touches client data.

## Compliance posture

- **SOC 2 Type I** in progress, expected within month 12 of operations
- **SOC 2 Type II** planned for year 2
- **ISO 42001 (AI management systems)** following the framework now; full certification planned for year 2
- **NIST AI Risk Management Framework** — our internal AI policy is mapped to NIST AI RMF and available on request
- **GDPR / CCPA** — we operate as a data processor on documented client instructions, with a DPA we countersign per engagement
- **HIPAA** — not currently covered; we don't take healthcare-adjacent BD work that touches PHI

## Prompt injection and adversarial input

Agents that read external content (rep emails, customer messages, vendor communications) face a real security risk: malicious actors can embed instructions in that content trying to manipulate the agent. We design every BD agent with this in mind:

- All external content is treated as untrusted data, never as instructions to the agent
- Outbound emails default to draft mode for human approval
- Domain allowlists limit autonomous outbound
- Sensitive actions (regulatory filings, customer-facing communications, anything affecting an account) always require human approval

For BD engagements specifically, we add a second layer: a privilege-separation pattern where untrusted external content goes through a "summarizer" agent with no tools, the trusted summary goes to a "decision-maker" agent that has tools but never sees raw external content. This is the recommended industry pattern (NIST AI 100-2, OWASP LLM Top 10) for high-stakes regulated workflows.

## Incident response

Documented incident response runbook covering data breach, prompt injection compromise, and integration credential exposure. In the event of a confirmed incident affecting your firm's data, we notify you within 24 hours. We coordinate with your CCO on FINRA notification obligations under Rule 4530 if applicable.

## Insurance

$1M/$3M Technology Errors & Omissions policy with affirmative AI coverage. $1M Cyber Liability. We can name the firm as additional insured per engagement on request.

## Questions

For specific security questions or to request our security questionnaire response, email security@agentwerke.com.
