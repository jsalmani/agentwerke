# Messaging notes

Working reference for keeping Avery's voice and our landing-page copy consistent. Update this as we learn.

## The reposition (April 2026)

Earlier copy leaned on what the agent does autonomously. CCOs and small-business owners read that as "you want to replace my team" — a non-starter. We rewrote the public surface around **"your team plus an agent"**: humans are the protagonist, the agent is the tool that gives them leverage.

This isn't just word-swapping. The underlying claim has shifted:

- **Old claim:** the agent handles 60-75% of the work, so you can avoid the hire.
- **New claim:** the same team takes on 60-75% more of the work because the agent does the heavy lifting alongside them.

The numbers are the same; the actor has changed.

## Phrasings to use

- "Your team plus an agent"
- "Same humans, with capacity they didn't have before"
- "Extends your [compliance/operations] team's capacity 3-5x"
- "Force multiplier for your existing team"
- "The agent does the heavy lifting; your people apply the judgment"
- "Your CCO supervises; the agent does the work"
- "Compliance Co-Pilot" (the co- prefix already implies collaboration — keep)
- "Agent operates inside your compliance workflow under your CCO's supervision"
- "Extend your compliance team's capacity 3-5x without adding headcount"

## Phrasings to avoid

- "Agent handles X%" / "agent processes X items per month" — when used as the lead benefit
- "Replace [percent] of the role"
- "Avoided hire" as the comparison anchor
- "Less than the loaded cost of one [role]" as the comparison anchor
- Any framing that positions the agent as the protagonist and humans as supporting cast
- Any framing that suggests the agent replaces a person

## Audience-specific notes

### Brokerage / CCO audience

- **Avoid "leverage"** — reads finance-bro to CCOs. Use "room to breathe," "added capacity," "force multiplier" (in moderation), or "throughput."
- Already-banned per `11-voice-meta.md` (brokerage section): "AI-powered," "transform," "revolutionize," "disrupt." Stick with "Claude-based" or "agent-based."
- Hero tagline pattern that worked: "Your compliance team, with room to breathe."
- Always preserve the "every regulatory output passes through human approval" framing. Never imply the agent acts independently in regulated workflows.

### SMB / parent audience

- "Leverage" is acceptable for SMB owners — it doesn't carry the same finance-industry connotation.
- Hero accent line that worked: "Same humans. New tools. Better leverage."
- Comparison anchor: "meaningful extra capacity at well under the loaded cost of a traditional hire" — talks about the team gaining capacity, not the owner avoiding a hire.

## Comparison-section anchoring

In both `02-pricing.md` files, the "How this compares" section now anchors against **extending what the team can take on without adding headcount**, not avoiding a specific hire.

The salary numbers (e.g., $50K-$65K office manager) are kept as "what equivalent capacity costs the traditional way." They're useful for grounding the math, but they're framed as the cost of headcount-driven growth rather than the cost the buyer is "avoiding."

## Case-study numbers — preserved verbatim

These are the ROI figures prospects use. Never paraphrase or remove. Only the framing around them changes.

Parent:
- 12-15 hours/week reclaimed by two admins (case 1)
- 4-5 hours/week reclaimed by managing partner (case 1)
- 70% of the departing OM's responsibilities absorbed by team + agent (case 2)
- $22/hour, 20 hours/week part-time coordinator (case 2)
- $42,000 annual savings vs. full replacement (case 2)
- 60-75% of the role taken on by team + agent together (common section)
- Payback under 5 months (common section)

Brokerage:
- Review queue under 24 hours; CCO hours back to 45-50/week; audit took 95 hours (down from ~110) (case 1)
- ~22,000 review items/month at >97% disposition rate (case 1)
- LOI-to-fully-transitioned dropped 38 → 22 days; rep dropout ~50% → ~15% (case 2)
- 60-75% of the work taken on by team + agent together (common section)
- Payback within 5-7 months (common section)

## Avery response length

Default: 2-4 sentences. Multi-paragraph answers are 2-3 short paragraphs separated by blank lines, never one long block. Anything that would honestly need 5+ sentences should either summarize and offer to go deeper, or suggest a discovery call. Lives in `lib/system-prompt.ts` under `# Length`.

## What was NOT touched in this pass

- Pricing numbers, tier structure, tier names
- Technical architecture descriptions in `06-security.md`, `08-tech-stack.md`
- The voice rules in `11-voice-meta.md`
- Anything in `/lib` outside `system-prompt.ts`
- Anything in `/app/api`, `/scripts`, `/evals`

Future copy passes that touch these should add a section here, not silently drift.
