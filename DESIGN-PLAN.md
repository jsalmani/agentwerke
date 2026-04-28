# Design Plan — Agentwerke

A redesign across three surfaces:

1. `/` — the parent SMB-agency homepage
2. `/demo` — chat with Avery (parent persona)
3. `/brokerage` — vertical landing page for independent broker-dealers

The product *is* the chat. The design's job is to frame the chat as a confident, real artifact — not bury it behind hero copy or marketing chrome. Every layout below ends with the chat being the most important thing on the page that has it.

---

## 1. Strategic direction

### Two visual identities, one shared chassis

The user said: parent should feel **warmer and more approachable**, brokerage should feel **more institutional and conservative**. So the design is two distinct aesthetic systems sharing the same component vocabulary (chat, cards, nav, footer) but diverging on:

- **Typography** — different display face per vertical
- **Palette** — warm umber/oxblood vs. cool navy/brass
- **Texture** — parent has subtle warmth (soft grain, rounded corners, organic accents); brokerage has discipline (hairline rules, tighter tracking, harder grid)
- **Voice in micro-copy** — already differentiated in `Chat.tsx`; the design reinforces it

This shows clients *we know what we're doing* — we don't paint a single template in two colors and call it a vertical strategy.

### What I'm explicitly avoiding

- **Generic SaaS "blue gradient + 3 feature cards + testimonial"** — looks like every vibe-coded landing page
- **Glassmorphism / neon AI tropes** — wrong signal for a paid services agency
- **Dark mode / "Cursor-style" homepage** — Avery is friendly and human; dark UI on a chat product is harder for non-technical visitors
- **Overdone illustration** — Anthropic-style restraint serves us better

### What I'm anchoring to

- Editorial polish (Are.na, Fraunces.com, Anthropic, Linear's marketing)
- Confident type-driven layouts, not pictures of robots
- The "honest stack" feeling (Stripe, Vercel docs) — the page itself looks like it could have been built with care, not stamped from a template

---

## 2. Typography

Both verticals load from Google Fonts via `next/font/google` (no `package.json` change needed; `next/font` is already in Next 15).

### Parent — `/` and `/demo`

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display (h1, h2) | **Fraunces** | 400, 500, 600 | Variable serif with warmth and personality. Used at large sizes with `--fraunces-soft` axis settings (SOFT 100, opsz 144) for the "expressive but serious" feel that suits a small specialist agency. |
| UI / body | **Inter** | 400, 500, 600 | Workhorse sans. Pairs with Fraunces without competing — the contrast is the point. |
| Mono (small accents, code-like labels) | **JetBrains Mono** | 400, 500 | Used sparingly for "live" indicator, status pills, technical asides. |

Why Fraunces: it's distinctive without being precious, has serious gravitas at body weight, and at display sizes its slight quirk reads as confident, not cute. It also sets Agentwerke apart from every other AI agency homepage using Geist or Inter Display.

### Brokerage — `/brokerage`

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display (h1, h2) | **Source Serif 4** | 400, 600 | A serious editorial serif designed for long-form. Reads like the *Wall Street Journal* / *Financial Times* — the right register for compliance officers and CCOs. |
| UI / body | **Inter** | 400, 500, 600 | Same body face as parent. Keeps the chat component visually consistent across verticals while the surroundings diverge. |
| Mono (data, ticker-style accents) | **JetBrains Mono** | 400, 500 | For figures, IDs, and small institutional touches. |

Why Source Serif 4: it carries the "regulated industry" weight without being stuffy. It's open enough at body sizes to be read by humans, restrained enough at display sizes to feel like a firm, not a coffee shop.

### Type scale (shared)

```
Display XL   72/1.02   tracking -0.02em   Fraunces or Source Serif 4
Display L    56/1.05   tracking -0.02em
H1           44/1.08   tracking -0.015em
H2           32/1.15   tracking -0.01em
H3           20/1.3    tracking -0.005em
Body L       18/1.55
Body         16/1.6
Body S       14/1.55
Caption      13/1.45   tracking 0.02em uppercase for labels
```

---

## 3. Color palette

### Parent — warm, contemporary

A near-neutral palette anchored on a confident warm accent. Background warmth is achieved with a paper tone, not with garish color.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F7F3EC` | Page background, large surfaces |
| `--paper-2` | `#EFE9DD` | Section bands, subtle layering |
| `--ink` | `#1B1714` | Headings, primary text |
| `--ink-soft` | `#3A332E` | Body text |
| `--mute` | `#857B70` | Captions, secondary copy |
| `--rule` | `#E2D9C8` | Hairline borders on warm bg |
| `--card` | `#FFFFFF` | Chat surface, pricing cards |
| `--accent` | `#C2410C` | Burnt-orange CTA, links (warm fire) |
| `--accent-soft` | `#FCE7D5` | Tinted backgrounds for callouts |
| `--success` | `#3F6B41` | Booking confirmed, "live" indicator |

The accent (`#C2410C`) is a confident burnt umber — distinctive without being trendy, and ages well. It evokes craftsmanship and small-batch quality.

### Brokerage — institutional, conservative

A two-tone palette anchored on deep navy ink and a muted brass accent. The whole page breathes restraint.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--bg-2` | `#F4F4F2` | Section bands |
| `--ink` | `#0B1B2E` | Headings, primary text (deep navy ink) |
| `--ink-soft` | `#1F3145` | Body text |
| `--mute` | `#5A6776` | Captions |
| `--rule` | `#D8DCE2` | Hairlines |
| `--card` | `#FFFFFF` | Card surfaces |
| `--accent` | `#8C6B2B` | Brass — restrained gold for CTAs and key figures |
| `--accent-soft` | `#F1EBDB` | Tinted callouts |
| `--navy` | `#1F3A5F` | Secondary brand emphasis |
| `--success` | `#2F5D3A` | Confirmed states |

Why brass instead of green/blue: brass and navy together is the visual language of old-money finance (Lazard, Brown Brothers, Vanguard's annual reports). It signals seriousness without being cold or clinical, and avoids the SaaS-blue trap entirely.

---

## 4. Layout direction per page

### `/` — parent homepage

**Posture:** confident, editorial, human. Hero leads with type, not a screenshot.

```
┌─────────────────────────────────────────────────────────────┐
│ NAV  [Agentwerke]              For BDs · Try Avery · Contact │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Custom Claude agents that handle                          │
│   the office work draining your team.                       │
│                                                             │
│   [supporting paragraph]                                    │
│                                                             │
│   [Talk to our agent →]  [Email us]                         │
│                                                             │
│   small text — the agent on this site is real, etc.         │
│                                                             │
├─── ribbon: "Live in two weeks · $12,000 + $1,000/month ····│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   What we build                          large heading      │
│                                                             │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│   │ Office Mgr  │ │ Customer    │ │ Workflow    │          │
│   │ Agent       │ │ -facing     │ │ Automation  │          │
│   └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   The agent on this page is real.        editorial pull-   │
│   It books real calls, sends real        quote with serif  │
│   confirmations, references our          flourish          │
│   real knowledge base.                                      │
│                                                             │
│        [Try Avery →]                                        │
├─────────────────────────────────────────────────────────────┤
│   Two ways we work                                          │
│   Two-card section: small business / broker-dealer         │
├─────────────────────────────────────────────────────────────┤
│   Footer · location · "Built on Anthropic Claude"           │
└─────────────────────────────────────────────────────────────┘
```

Layout choices:
- Wide left-aligned hero (~880px max) — type-led, no hero image
- A horizontally-scrolling ribbon below the hero with the price/timeline ticker. Subtle, not gimmicky — sets the "no hidden price" tone immediately
- "What we build" cards have a small framed-icon corner mark instead of stock illustration — ✱-style ornament in accent
- Editorial pull-quote section that sells the demo with a clear CTA into `/demo`
- Two-track "where we work" section that surfaces the brokerage vertical without burying it

### `/demo` — Avery, parent persona

**Posture:** the chat is the page. Everything else is supporting cast.

```
┌─────────────────────────────────────────────────────────────┐
│ ← Agentwerke                              Try Avery — Demo  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Talk to Avery.                                            │
│   Avery is the agent on Agentwerke's website. ...           │
│                                                             │
│   live · powered by Claude    [small status row]            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────────────────────────┐  ┌──────────────────────┐  │
│   │                            │  │ What's happening     │  │
│   │     CHAT (centerpiece,     │  │ The stack            │  │
│   │     ~720px tall, premium   │  │ Want one?            │  │
│   │     surface, soft shadow)  │  │                      │  │
│   │                            │  │ —— editorial side    │  │
│   │                            │  │ rail, narrow         │  │
│   └────────────────────────────┘  └──────────────────────┘  │
│                                                             │
├─── footer ──────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────┘
```

Layout choices:
- Trimmed page chrome — short header, no marketing nav
- Chat card lifted with a soft warm shadow (not a bevel) and a slim "live" pulse in the header
- Side rail uses the same Fraunces small-caps section labels as the homepage so verticals feel consistent
- On mobile, side rail collapses *below* the chat — chat must be first
- Subtle paper background so the white chat card has something to sit on

### `/brokerage` — broker-dealer vertical

**Posture:** institutional. Reads like a thoughtfully-edited firm overview, not a pitch deck.

```
┌─────────────────────────────────────────────────────────────┐
│ NAV  Agentwerke / for Broker-Dealers      Pricing · Talk    │
├─────────────────────────────────────────────────────────────┤
│   small caps label: FOR INDEPENDENT BROKER-DEALERS          │
│                                                             │
│   Extend your compliance team's                             │
│   capacity 3–5× without adding                              │
│   headcount.                          [serif display]       │
│                                                             │
│   [supporting paragraph]                                    │
│                                                             │
│   [Talk to our agent →]   [Email us]                        │
├─── strip: works alongside Smarsh · Global Relay · Cisco ····│
├─────────────────────────────────────────────────────────────┤
│   What we build                                             │
│   Three engagements, displayed as numbered editorial blocks │
│   with hairline rules between them, not card pillows.       │
├─────────────────────────────────────────────────────────────┤
│   Pricing                                                   │
│   Three pricing columns, hairline-bordered, brass numbers.  │
│   "Most common" is *brass-rule top* not a glow effect.      │
├─────────────────────────────────────────────────────────────┤
│   How a Compliance Co-Pilot fits                            │
│   Editorial 3-step: WSPs in → Agent triages → CCO reviews   │
├─────────────────────────────────────────────────────────────┤
│   Talk to Avery — chat (institutional theme)                │
├─────────────────────────────────────────────────────────────┤
│   Footer with regulatory disclaimer line                    │
└─────────────────────────────────────────────────────────────┘
```

Layout choices:
- Hero uses `Source Serif 4` at large weight; small all-caps eyebrow above for "FOR INDEPENDENT BROKER-DEALERS"
- "Built around your existing stack" strip with the archiving vendors named — concrete trust signal
- Pricing cards: borderless, divided by hairline rules, headline figures in `Source Serif 4` so prices feel weighty and considered
- Add a "How it fits" workflow diagram (text-only, three-step editorial) — the missing piece on the current version
- Chat: same component, but themed with navy/brass header, monospace status text, and a small "transcripts retained for supervisory review" note. This is a real concern for compliance buyers and the design should acknowledge it.
- Footer carries a small regulatory disclaimer (Agentwerke is not a registered broker-dealer / does not provide regulatory advice).

---

## 5. Component-level decisions

### Chat component (`app/components/Chat.tsx`)

The same component renders for both verticals; theming is driven by the `vertical` prop and CSS variables on the surrounding wrapper.

- Parent theme: warm card on paper, ink text, burnt-umber send button, friendly avatar
- Brokerage theme: white card on light gray, navy ink text, brass send button, monospace tagline ("session 2dc1… · live"), small "supervisory review" footnote
- "Thinking" indicator stays the same dot animation in both — it's a loading state, not a brand surface
- Tool-call breadcrumbs (`⚙ Using Jason's calendar…`) get a slight visual upgrade — replaced with a tiny status pill that matches the vertical's accent

### Buttons

Primary CTA (`Talk to our agent →`):
- Parent: solid burnt-umber background with paper text; soft shadow
- Brokerage: solid navy background with white text; no shadow, just hairline border
- Both: 14px Inter Medium, 12px vertical padding, 20px horizontal, 6px border radius (parent) / 4px (brokerage)

Secondary CTA (`Email us`):
- Parent: hairline border on paper, ink text, hover fill `--paper-2`
- Brokerage: hairline border on white, navy text, hover fill `--bg-2`

### Hairline rules

Brokerage relies heavily on 1px hairlines for hierarchy (no big card shadows). Parent uses softer borders + occasional warm shadow. This single decision does most of the visual differentiation work.

---

## 6. Design references

| Reference | What I'm taking |
|---|---|
| **anthropic.com** | Restraint, type-led hero, no robot stock photography |
| **linear.app/method** | Editorial pacing, confident scale jumps |
| **stripe.com** | Honest UI screenshots framed as the product |
| **fraunces.com** | The Fraunces specimen page itself — proof the typeface carries weight |
| **wsj.com / ft.com** | Source Serif vibes, hairline-driven layout for the brokerage page |
| **lazard.com / bbh.com** | Navy + restraint as the language of "we are old enough to be trusted" |
| **vercel.com/templates** | Card structure, soft shadow language for the parent variant |
| **are.na** | Editorial pull-quote treatment, subtle scrolling behaviors |

---

## 7. What this plan does *not* do

- **No new dependencies.** Fonts via `next/font/google` only. No icons library, no Framer Motion, no Radix. Every interaction can be done with Tailwind transitions.
- **No new pages.** Three pages, one component file, layout/globals/tailwind.
- **No copy rewrites.** The agency's copy is good. Design carries the lift.
- **No changes to `lib/`, `api/`, `knowledge-base*`, `scripts/`, `evals/`, `package.json`, or `.env*`.** This is purely a presentation layer pass.

---

## 8. Implementation order

1. Set up shared infrastructure (this commit will not change visual output): `next/font` imports in `layout.tsx`, CSS variables in `globals.css`, theme tokens in `tailwind.config.js`. Bundled into the homepage commit so the page that lands first lands with its supporting cast.
2. **Homepage** — type, palette, ribbon, editorial pull-quote, two-track footer section.
3. **Demo page** — trimmed chrome, chat as centerpiece, refined side rail.
4. **Brokerage page** — institutional theme, hairline pricing grid, "how it fits" workflow, chat in brokerage theme.
5. **DESIGN-NOTES.md** — what I shipped, what I struggled with, what to reconsider.
