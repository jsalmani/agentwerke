# Security and Data Handling

Agentwerke takes data handling seriously because our clients are trusting us with the operational center of their business. This document describes our current posture, the controls we have in place, and what we're working toward.

## Where your data goes

When your agent is running, data flows through three categories of systems:

1. **Anthropic's Claude API.** The agent's reasoning happens here. Anthropic does not retain prompts or outputs by default for paid commercial API use, and your data is not used to train Anthropic's models.
2. **The integrations you authorize.** Your Gmail or Outlook, your calendar, your CRM. The agent reads from and writes to these via OAuth tokens you grant. We don't see your raw account credentials.
3. **Our own infrastructure.** We store conversation logs, tool-call audit trails, and operational metadata in a Postgres database hosted on Supabase (US region, encrypted at rest). We retain this data for 12 months for debugging and improvement, then delete it.

## What we don't do with your data

- We do not sell, rent, or share your data with any third party.
- We do not use your data to train any AI models — ours or anyone else's.
- We do not aggregate your data with other clients' data for any purpose, including analytics.
- We do not access your data outside of building, debugging, and improving your specific agent.

## Access and tenant isolation

- Each client's data is stored in a logically isolated namespace. The agent for Client A cannot read data from Client B, by design.
- API keys are per-client. Anthropic Workspaces gives us spend isolation and key isolation across clients.
- OAuth tokens for client systems are encrypted at rest using envelope encryption. The data encryption key lives in the database; the key encryption key lives in a separate secrets manager (currently Doppler, moving to AWS KMS in our SOC 2 buildout).
- Every read, draft, and send by the agent is logged with timestamp, action type, target, and a hash of the prompt and output. Logs are immutable and retained for one year.

## OAuth scopes — least privilege

We use the minimum OAuth scopes necessary for the agent's job. For example:

- Gmail: `gmail.readonly` for summarization, `gmail.send` for explicit send actions, `gmail.compose` for drafts. We avoid the broad `gmail.modify` scope.
- Microsoft Graph: `Mail.Read`, `Mail.Send`, `Calendars.ReadWrite`. We avoid `Mail.ReadWrite.All`.
- We prefer per-user delegated OAuth over domain-wide delegation.

## Subprocessors

Our subprocessors as of April 2026:

- **Anthropic** (Claude API)
- **Vercel** (application hosting, US)
- **Supabase** (managed Postgres, US)
- **Cal.com** (booking infrastructure)
- **Resend** (transactional email)
- **Doppler** (secrets management)

We provide 15 days' notice before adding a new subprocessor.

## Compliance posture

- **GDPR.** As an agency we operate as a data processor on documented client instructions. We have a Data Processing Addendum based on Anthropic's DPA terms that we countersign with every client.
- **CCPA.** Our Privacy Policy meets CCPA requirements for transparency and data subject rights.
- **SOC 2 Type I.** In progress. Target completion: month 12 of operations or first client requirement, whichever comes first.
- **SOC 2 Type II.** Planned for year 2.
- **ISO 42001 (AI management systems).** Following the framework now; full certification planned for year 2.
- **NIST AI Risk Management Framework.** Our internal AI policy is mapped to NIST AI RMF and is available on request.
- **HIPAA.** Not currently covered. We do not take healthcare clients with PHI workflows until our BAA chain is in place.

## Prompt injection and adversarial input

Agents that read external content (email, customer messages) face a real security risk: malicious actors can embed instructions in that content trying to manipulate the agent. We design every agent with this in mind:

- All external email content is treated as untrusted data, never as instructions to the agent.
- Outbound emails default to draft mode for human approval.
- Domain allowlists limit who the agent can send to autonomously.
- Sensitive actions (payments, contract execution, account changes) always require human approval — the agent has no authority to execute these directly.

## Incident response

We have a documented incident response runbook covering data breach, prompt injection compromise, and integration credential exposure. In the event of a confirmed incident affecting your data, we notify you within 24 hours.

## Questions

For specific security questions or to request our security questionnaire response, email security@agentwerke.com.
