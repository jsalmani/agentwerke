# How We Build Your Agent

Every Agentwerke engagement follows the same five-phase process. Total elapsed time from signed SOW to a working agent in production is typically two weeks for the Office Manager Agent tier, three to four weeks for the Operations Suite.

## Phase 1: Discovery (3-4 days)

We spend the first few days understanding your business, your workflows, and where the agent will create the most leverage.

- A 60-minute kickoff call with you and any key team members
- Review of your current tools (email, calendar, CRM, document storage, anything else relevant)
- Workflow mapping — we document the specific tasks the agent will handle
- Knowledge base inventory — we identify what documents the agent needs to know
- Decision on integrations and access — what systems does the agent need to read from and write to

You walk out of discovery with a written **Agent Brief** — a 3-5 page document specifying exactly what your agent will do, what it won't do, and how we'll know it's working.

## Phase 2: Build (5-7 days)

We build the agent against the brief.

- System prompt and behavior design — how the agent introduces itself, escalates, refuses, asks clarifying questions
- Tool integration — connecting to your calendar, email, CRM, etc. via OAuth (you grant access; we configure)
- Knowledge base ingestion — your docs go into the agent's working knowledge
- Workflow automations — multi-step processes scripted and tested
- Eval suite — we write a set of test cases the agent must pass before go-live

This is heads-down build time. You'll get a Loom-style demo around day 5 showing the agent in action.

## Phase 3: Train and tune (2-3 days)

We sit with the agent and your real-world workflows.

- Run the agent against last week's actual emails, calendar, and CRM events
- Tune the system prompt based on what we observe
- Build escalation rules for the edge cases the eval suite missed
- Train you and your team on how to interact with the agent — what to ask, when to override, how to give feedback

## Phase 4: Supervised launch (5-7 days)

The agent goes live in your business, but in supervised mode.

- All outbound communications are drafted, not sent — you approve before anything goes out
- Daily review for the first week
- Quick adjustments as you spot anything off

By the end of week 2, the agent is operating in your business with reduced supervision. Routine tasks run automatically; anything novel surfaces for your review.

## Phase 5: Handoff and ongoing improvement

- A handoff document specifying every workflow, integration, and escalation rule
- Login access to the agent's admin dashboard so you can see what it's doing
- A monthly review and optimization session
- Quarterly business reviews to identify expansion opportunities

The retainer covers all monitoring, prompt tuning, model updates, and minor changes. Major new workflows are scoped separately as add-ons.

## Timeline overview

| Phase | Duration | Cumulative |
|---|---|---|
| Discovery | 3-4 days | Week 1 |
| Build | 5-7 days | Week 1-2 |
| Train and tune | 2-3 days | Week 2 |
| Supervised launch | 5-7 days | Week 2-3 |

Most clients see an agent doing real, useful work in their business within 14 calendar days of signing.
