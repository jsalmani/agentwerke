# Frequently Asked Questions

## About the agent itself

**What model is the agent built on?**
Anthropic's Claude — Claude Sonnet 4.6 and Claude Haiku 4.5 depending on the task. Sonnet for compliance review reasoning and complex documentation; Haiku for high-volume triage and routine workflows.

**Why Claude and not GPT or another model?**
Three reasons that matter for broker-dealers. First, Claude follows detailed instructions more reliably than alternatives — critical when the agent needs to enforce your WSPs without drift. Second, Anthropic's safety posture and zero-data-retention default for paid commercial API use makes the data-handling story cleaner than competitors. Third, Claude's long context window lets us put your full WSP and compliance manual directly in front of the model on every interaction, rather than relying on RAG retrieval that can miss critical context.

**Can the agent learn from our specific firm over time?**
Yes, but not by retraining. The agent doesn't update its weights from your data. We update the agent's system prompt, knowledge base, and approval rules monthly based on what we observe. Improvement happens via prompt and rule changes that you and your CCO approve before going live. Your data is never used to train Anthropic's models.

**Does the agent ever hallucinate or make things up?**
Less than you'd think with current models, but not zero. We mitigate this in four ways: (1) the system prompt explicitly tells the agent to say "I don't know — escalate" rather than guess, (2) every regulatory output is staged for human approval, (3) we run a continuous eval suite that catches regressions on every prompt change, (4) all agent decisions are logged and reviewable by your CCO.

## About compliance and regulatory posture

**Who is responsible if the agent makes a compliance mistake?**
Your firm. The agent is a tool; your CCO is the responsible party. We design the agent so every regulatory output passes through human approval — there's a human signature on every U4 amendment, every customer complaint logged, every suitability narrative before it leaves the firm. Our liability is bounded by our errors and omissions insurance and the contract; ultimate compliance responsibility stays with the firm.

**How does this fit with our written supervisory procedures?**
Part of the engagement is updating your WSPs (with your CCO) to incorporate the agent's role. The agent operates as an extension of the existing supervisory framework, not a workaround. We've designed the documentation so a FINRA examiner can see exactly what the agent does, what rules govern it, and where the human checkpoints are.

**Will FINRA have a problem with us using AI for this?**
FINRA has been clear in recent guidance (notably their AI Insights from 2024 and 2025) that AI tools are permitted for compliance and operational work, provided firms maintain appropriate supervision and books-and-records. Some firms have already disclosed AI use in their supervision in regulatory filings. The key is documentation and human approval gates — both of which we build in by default.

**What about the SEC's stance?**
The SEC's predictive analytics rules (Reg AI) primarily address AI use in investment recommendations to retail customers — not the back-office and compliance work we focus on. Our agents don't make investment recommendations. We're explicit about this with every prospect.

**Do you have a SOC 2 report?**
SOC 2 Type I in progress, expected within our first year of operations. We can share our security questionnaire response and current controls documentation today. For firms requiring SOC 2 Type II before engagement, we can structure a deferred go-live tied to certification.

## About data and security

**Where does our firm data go?**
Three categories of systems: (1) Anthropic's Claude API (no training, no retention by default), (2) the integrations you authorize via OAuth (your CRM, archiving, compliance system), (3) our own infrastructure where we store conversation logs and audit trails (Postgres on Supabase, US region, encrypted at rest, 12-month retention then deleted).

**Can the agent's conversations be retrieved as books and records?**
Yes — that's a core requirement. Every agent interaction is logged with timestamp, content, action taken, and human approver. We export this in the format your archiving vendor expects, so it lands in your existing 17a-4 retention pipeline.

**Do you sign DPAs?**
Yes. We have a Data Processing Addendum that covers our role as a data processor on documented client instructions. We countersign as part of the engagement.

**Is our customer PII encrypted?**
Yes. In transit (TLS 1.2+) and at rest (AES-256 envelope encryption with the key encryption key in a separate secrets manager).

**What happens to our data if we terminate?**
We export your conversation logs and operational data within 30 days, in formats your archiving vendor accepts. OAuth tokens are revoked. Your knowledge base content is yours. The agent itself (system prompt, tool definitions) is our IP unless you've exercised the buyout option.

## About the cost

**Is the price negotiable?**
The setup fee is fixed for the productized tiers. Custom scope outside the tier definitions is quoted separately. The retainer is fixed for your tier; if your usage exceeds the tier quota, overages are billed transparently at the published rate.

**What if Anthropic raises prices?**
Our retainer covers normal API cost variance. If Anthropic raises prices materially (more than 25%), we reserve the right to revisit the retainer with 60 days' notice — but the trend in Claude pricing has been steadily down, not up.

**Do you offer outcome-based pricing?**
For specific workflows where the outcome is measurable (e.g., "$X per qualified compliance review processed within SLA"), yes. It's not the default because most compliance work doesn't have a single clean metric.

**How does this compare to per-seat compliance tech?**
Per-seat tools (archiving, surveillance, compliance management) are still required — we integrate with them, we don't replace them. We're additive: we make your compliance team 3-5x more productive *within* the tools you already pay for. Net result is usually that you delay or avoid hiring additional compliance headcount.

## About working together

**Where are you based?**
Chapel Hill, NC. We work with broker-dealer clients across the United States, with in-person engagement available within the Mid-Atlantic and Southeast regions for discovery and major reviews.

**How big is your team?**
Small and intentional. The founder leads every engagement personally. We don't hand you off to a junior implementer.

**What if we're not happy with the agent?**
We have a 30-day satisfaction guarantee on the setup fee. If the agent isn't doing what we agreed it would do at the end of the build, we keep working until it is, or we refund the setup fee. The retainer is month-to-month after the initial 90-day commitment.

**What if we want to take the agent in-house later?**
After the initial 12-month term, we offer a buyout option giving you full ownership of the agent's IP. Pricing is one year of retainer fees. Most clients don't take this — the ongoing maintenance and regulatory-update value outweighs the buyout — but it's available.

**Do you have references?**
We're a young firm. We can put you in touch with our advisor (former president of an independent BD) and walk you through implementations in detail. As we close named engagements, references will follow.

## About what the agent can and cannot do

**Will the agent replace our compliance team?**
No. The agent extends your compliance team's capacity — handles the high-volume repetitive review work so your CCO and analysts can focus on judgment calls, escalations, and supervisory cases. Most clients find they avoid hiring additional compliance headcount; some redeploy existing staff to higher-value work.

**Can the agent send emails on the firm's behalf?**
Drafts emails for human approval by default. Auto-send is enabled only for explicitly low-risk categories (e.g., routine confirmation emails to clients) where the firm's CCO has approved the workflow. No regulatory or customer-facing communication leaves the firm without a human signature.

**Can it talk to clients directly?**
Customer-facing chat is a separate conversation. FINRA communications rules and fiduciary considerations make this complex; we handle internal-facing rep copilots first, and customer-facing only after we've gone through the regulatory review with the firm.

**Does it work with our archiving vendor?**
Yes. We integrate with Smarsh, Global Relay, Cisco/Cumulus, and others. Every agent interaction lands in your existing archiving pipeline.

**What about firm-specific custom requirements?**
The system prompt and approval gates are bespoke per firm. If your WSPs require, e.g., dual-principal approval on certain transactions, the agent enforces that.
