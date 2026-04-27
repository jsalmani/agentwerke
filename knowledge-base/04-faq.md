# Frequently Asked Questions

## About the agent itself

**What model is the agent built on?**
Anthropic's Claude — specifically Claude Sonnet 4.6 and Claude Haiku 4.5, depending on the workload. Haiku for fast, high-volume interactions; Sonnet for more complex reasoning and multi-step workflows.

**Why Claude and not GPT or another model?**
Claude is the best general-purpose model for agentic workflows in 2026. It handles tool use reliably, follows instructions precisely, and has a long context window that lets us put your entire knowledge base directly in front of the model. Anthropic's safety posture also matters for businesses that take data handling seriously.

**Can the agent learn over time?**
Yes, but not in the way people sometimes assume. The agent doesn't retrain itself. We update its system prompt, knowledge base, and workflows monthly based on what we observe — and that's where improvement happens. Your data is never used to train Anthropic's models.

**Does the agent ever hallucinate or make things up?**
Modern Claude models are quite good at staying grounded in their knowledge base, but no AI is perfect. We mitigate this in three ways: (1) the agent's system prompt explicitly tells it to say "I don't know" rather than guess, (2) for any external-facing communication, we default to draft mode so a human reviews before send, (3) we run a continuous eval suite that catches regressions.

## About the build

**How long does it take?**
Two weeks for the Office Manager Agent tier. Three to four weeks for the Operations Suite.

**What do I need to provide?**
Documentation of the workflows you want the agent to handle, OAuth access to the systems it needs (Gmail/Outlook, calendar, CRM), and your knowledge base content (services, pricing, FAQs, procedures). We help you assemble all of this in discovery.

**Do you build on Lovable, Voiceflow, Chatbase, or a no-code platform?**
No. We build custom on Claude's API directly. No-code platforms add a layer of abstraction we don't want — they limit what we can build, and you'd be paying their per-seat fees on top of ours.

**Can I see the code?**
Yes. We can put the agent's system prompt, tool definitions, and orchestration code in a GitHub repo you have read access to. We retain ownership and licensing rights, but transparency is part of how we work.

## About data and security

**Where does my data go?**
Your data goes through Anthropic's API to Claude, and into the integrations you configure (your calendar, email, CRM). We do not use your data to train any models. We do not sell or share your data. Anthropic's API does not retain prompts and outputs by default for paid commercial use.

**Do you sign DPAs?**
Yes. We have a standard Data Processing Addendum based on Anthropic's DPA terms. We countersign it as part of the engagement.

**What about HIPAA?**
We are not currently HIPAA-covered. We're not taking healthcare clients with PHI workflows until our BAA chain is fully in place. If you're a healthcare client and you have non-PHI workflows (e.g., scheduling for a non-clinical practice), we may still be able to help.

**SOC 2?**
We are working toward SOC 2 Type I in our first year. We can share our security posture and current controls on request.

## About the cost

**Is the price negotiable?**
The setup fee is fixed for the productized tiers. Custom scope outside the tier definitions is quoted separately. The retainer is fixed for your tier; if your usage exceeds the tier quota, overages are billed transparently.

**What happens if Anthropic raises prices?**
Our retainer covers normal API cost variance. If Anthropic raises prices materially (more than 25%), we reserve the right to revisit the retainer with 60 days' notice — but in three years of Claude pricing, the trend has been steadily down, not up.

**Do you offer outcome-based pricing?**
We can structure outcome-based pricing for specific workflows where the outcome is measurable (e.g., "$X per qualified meeting booked"). It's not the default because most office-manager work doesn't have a single clean outcome metric.

## About working together

**Where are you based?**
Chapel Hill, NC. We work with clients in the Triangle (Raleigh, Durham, Cary, Chapel Hill) in person, and clients across the US remotely.

**How big is your team?**
Small and intentional. The founder leads every engagement personally. We don't hand you off to a junior implementer.

**What if I'm not happy with the agent?**
We have a 30-day satisfaction guarantee on the setup fee. If the agent isn't doing what we agreed it would do at the end of the engagement, we keep working until it is, or we refund the setup fee and unwind cleanly. The retainer is month-to-month after the initial 90-day commitment.

**What if I want to take the agent in-house later?**
After the initial 12-month term, we offer a buyout option that gives you full ownership of the agent's IP. Pricing is one year of retainer fees. Most clients don't take this — the ongoing maintenance value outweighs the buyout — but it's there.

**Do you do equity deals or revenue-share?**
Not at this stage. Cash engagements only.

## About what the agent can and cannot do

**Will the agent replace my office manager?**
It depends. For some clients, the agent handles enough of the work that they don't need to fill an open role. For others, it makes their existing office manager dramatically more productive. We're honest about the line: the agent is excellent at repetitive, structured work and good at semi-structured work. It's not a substitute for the relationship-building, judgment-call work that a good office manager does.

**Can the agent send emails on my behalf?**
Yes, but by default it drafts emails for your approval. Auto-send is enabled for specific categories (e.g., meeting confirmations to known contacts) where the risk is low and the volume justifies it.

**Can it talk to customers directly on my website?**
Yes — that's exactly what Avery, the agent you're talking to right now, does for us. Your customer-facing agent would be configured for your business with your knowledge base.
