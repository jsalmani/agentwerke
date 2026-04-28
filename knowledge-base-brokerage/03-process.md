# How We Build Your Agent

Every Agentwerke broker-dealer engagement follows the same five-phase process. Total elapsed time depends on tier — eight weeks for the Onboarding Accelerator, twelve for the Compliance Co-Pilot, sixteen for the Rep Productivity Suite. We move faster than enterprise software vendors because we're not enterprise software vendors. We build for one client at a time.

## Phase 1: Discovery (1-2 weeks)

We spend the first weeks understanding your firm, your supervisory structure, and the workflows the agent will operate inside.

- A 90-minute kickoff call with your CCO, COO, and any key principals
- Review of your written supervisory procedures (WSPs) — the agent must operate within them
- Workflow mapping — we document the specific tasks the agent will handle, with regulatory citations for each
- Knowledge base inventory — your WSPs, compliance manual, suitability framework, training materials, FINRA letters, internal policies all become the agent's working knowledge
- Decision on integrations and access — what systems does the agent need to read from and write to (CRM, archiving, compliance management, custodian platform, etc.)
- Risk-tier classification — we categorize each agent task by regulatory blast radius and define the appropriate human-approval gates

You walk out of discovery with a written **Agent Brief** that documents exactly what your agent will do, what it won't do, what regulatory rules govern each function, and how we'll measure success. This becomes part of your firm's books and records — it's a defensible artifact for FINRA exams.

## Phase 2: Build (4-12 weeks depending on tier)

We build the agent against the brief.

- System prompt and behavior design with regulatory guardrails
- Tool integration with your systems via OAuth or direct API
- Knowledge base ingestion — your WSPs and policies become the agent's source of truth
- Workflow automations with explicit human-approval gates
- Eval suite — for each agent function, we write 30-50 test cases covering normal, edge, and adversarial inputs. The agent must pass before go-live.

You'll get a working demo around the midpoint of the build.

## Phase 3: Compliance review and tuning (1-2 weeks)

This phase is unique to regulated engagements.

- Your CCO or designated principal reviews the agent's behavior across realistic scenarios
- We tune the system prompt and approval gates based on what they observe
- We document the agent's decision logic for the firm's books and records
- We update your WSPs (with your CCO) to reference the agent's role — required for regulatory readiness

## Phase 4: Supervised launch / shadow mode (30 days)

The agent operates in your firm but in supervised mode.

- All agent outputs are shown to a human reviewer before they leave the firm or affect a record
- Daily review for the first two weeks
- The shadow period generates a paper trail showing the agent's accuracy across thousands of decisions before any auto-approval thresholds turn on

By the end of week 4, the agent is operating in your firm with reduced supervision on low-risk categories (e.g., routine email approvals), while sensitive categories (e.g., new account openings, OBAs) remain in mandatory-approval mode.

## Phase 5: Handoff and ongoing improvement

- A handoff package: every workflow, integration, escalation rule, and approval gate documented
- Read-only login to the agent's admin dashboard so your CCO can audit any decision
- Monthly optimization session — we review what the agent is doing, where it's struggling, what to improve
- Quarterly business reviews
- Updates pushed when FINRA issues new guidance that affects the agent's rules

The retainer covers monitoring, prompt tuning, model updates, and minor changes. Major new workflows are scoped as add-ons.

## What this looks like to FINRA

We've engineered every Agentwerke agent for regulatory defensibility. Your CCO can show an examiner:

- The Agent Brief defining scope and rules
- The eval suite showing the agent passes its tests on every change
- The audit log showing every action with human approver, timestamp, and decision rationale
- The system prompt demonstrating the rule-following logic
- The integration with your books-and-records retention system

The agent extends your supervisory framework — it doesn't replace it. Your CCO is still the responsible party for compliance decisions; the agent is a tool that does the heavy lifting.
