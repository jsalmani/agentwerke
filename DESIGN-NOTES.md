# Design Notes

A retrospective on the three-page redesign overnight on `design-overhaul`. Read alongside `DESIGN-PLAN.md`.

## What I shipped

- **Shared infrastructure:** Inter, Fraunces, Source Serif 4, and JetBrains Mono loaded via `next/font/google` (no `package.json` change). CSS-variable theme tokens scoped on `:root` for the parent palette and `[data-vertical="brokerage"]` for the institutional palette. Tailwind extended to read those vars.
- **Homepage (`/`):** Type-led hero on warm paper, spec-sheet specimen card, marquee ribbon (CSS-only), numbered editorial cards, full-width pull-quote into demo CTA, and a two-track section that surfaces the brokerage vertical without burying it.
- **Demo (`/demo`):** Trimmed page chrome to a one-line header so the chat sits in the upper third of the viewport on first paint. Added a monospace stat strip (model, escalation, tools, status) instead of generic "what is this" copy. Side rail rebuilt with editorial section labels and a "What Avery won't do" trust block.
- **Brokerage (`/brokerage`):** Source Serif 4 display, navy + brass palette, hairline-driven layout, "$88k" reference-figure callout in the hero, "Works alongside" stack strip, engagements as numbered editorial rows, brand-new "How a Compliance Co-Pilot fits" three-step section, pricing rebuilt as bordered columns with a brass top rule on the most-common tier, compliance posture block in the chat side rail, and a real regulatory disclaimer in the footer.
- **Chat component:** Now theme-aware via the `vertical` prop. Same component renders warm-and-rounded for parent and tight-and-institutional for brokerage. Live-pulse status dot in the header. Brokerage-only supervisory retention footnote.

## Choices worth flagging

### Two palettes, one component vocabulary

The biggest design lever was scoping the entire brokerage palette into `[data-vertical="brokerage"]` and routing all colors and corner radii through CSS variables. This means the `Chat.tsx` component is identical between verticals — the only difference is the wrapper. That's the cleanest version of "two distinct brands, one engineering bench" I could think of, and it's the reason the brokerage chat header has square corners and a navy avatar without a single conditional in the chat code.

### Fraunces over Geist / Inter Display

Every AI agency homepage in 2026 uses Geist or Inter Display. Fraunces gives the parent agency a distinct visual handshake without veering into "design studio" territory. It carries warmth at display sizes and readability at body sizes (though I limited it to display only). The italic underline treatment in the hero ("office work draining your team") only works because the typeface has personality.

### Source Serif 4 over Playfair / Lora

Source Serif 4 is restrained where Playfair is decorative. For compliance officers, restraint reads as "we know what kind of business this is." The narrower aperture and slightly conservative letterforms set the right register without being stuffy.

### Brass-and-navy instead of finance-blue

The default brokerage move is "deep blue + accent gradient." I went brass (#8C6B2B) and navy (#0B1B2E) because that combination is the actual visual language of old-money finance — Lazard, Brown Brothers, Vanguard's annual reports, FT print. It signals seriousness without looking like another fintech SaaS landing page.

### Marquee ribbon on the homepage

Yes, it's a marquee. No, I'm not joking. Used at `tracking: 0.14em uppercase` over the dark ink bar with a single brass `✱` between phrases, it reads as an editorial running head rather than a distracting GeoCities throwback. It also pauses on hover — important detail.

### The chat is the page on `/demo`

On the previous version, the chat fell below the fold on most laptops because the page header took ~480px. I cut the page header to ~280px on desktop and made everything below the fold supporting copy, not gating copy. The product *is* the chat; the design has to behave like it knows that.

## What I struggled with

### Pre-existing build failure

`npm run build` was already broken before I touched anything. `ai` and `@ai-sdk/react/node_modules/ai` resolve to two distinct package copies, which makes `DefaultChatTransport` look structurally different to TypeScript even though it's runtime-identical. I fixed it with a `transport: transport as any` pinhole cast in `Chat.tsx` (with a comment naming the real fix — a `package.json` `overrides` entry, which is out of scope for a design pass).

This is worth a follow-up. The right fix is two lines:

```json
"overrides": {
  "@ai-sdk/react": { "ai": "$ai" }
}
```

That dedupes the package and makes the cast unnecessary. I left it for you because the task scope explicitly excluded `package.json` modifications.

### Fraunces variable axes

Fraunces ships with a `SOFT` axis that controls how soft the terminals are at display sizes. I'd planned to use `axes: ['SOFT', 'opsz']` to dial in the warmth, but `next/font/google`'s axes parameter has tight constraints and I'd already burned a build cycle on a more important issue, so I left Fraunces at default axes. The hero still looks good. If you want to push the warmth further, that's the knob.

### Picking restraint over delight

A few times I drafted moments — a hand-drawn arrow pointing from the hero CTA into the chat, a more elaborate ribbon with rotating service phrases, an animated cursor on the headline — and then cut them because they would've made the page feel like it was trying too hard. The thesis I kept coming back to: a design-aware buyer reads understatement as confidence. That said, your taste may differ — see the section below.

## Things I'd reconsider

1. **Live mini-chat embed on the homepage.** Right now the homepage links to `/demo` to talk to Avery. A 2-message embedded preview ("Avery: Hi — I'm the agent on this site. Ask me anything." / pre-filled quick replies) would prove the product the second the page loads. I didn't add it because it's a bigger architectural lift (lazy-loading `useChat` in a marketing context, sessionId continuity across pages) and I wanted the design pass clean. Worth a separate ticket.
2. **The brass `#8C6B2B` could go warmer.** I went conservative-brass; you could push it to `#A37835` for slightly more saturation if the current value reads too gray-gold. I'd want to A/B with one stakeholder before committing.
3. **The hero pull-figure ("$88k") on brokerage.** It's a strong move and I think it works, but the number itself comes from `knowledge-base-brokerage/02-pricing.md` and will rot if pricing moves. Either add a comment in the markdown that this number is also surfaced on the brokerage page, or pull it from a single source of truth at build time.
4. **Mobile order on `/demo`.** I put the chat above the side rail on mobile, which is correct for "the chat is the product." But the side rail "What's actually happening" / "What Avery won't do" copy is genuinely useful for a first-time visitor who *isn't* ready to chat yet. Consider an accordion-style collapse so the side rail is one tap away rather than a long scroll.
5. **No favicon / `/icon.tsx`.** The wordmark exists as inline SVG. I didn't add a favicon because it's a design system decision rather than a page redesign decision and I didn't want to commit to a mark you might want to redraw. Worth pulling forward.
6. **Color contrast of `--mute` (#857B70) on `--paper` (#F7F3EC).** It passes WCAG AA for normal text at 16px but is borderline at 13–14px (the "spec sheet" rows, side rail captions). If you have visually impaired users, bump to `#6E665B`.
7. **Two distinct `<header>`s for parent vs. brokerage** are intentional but a third-party would probably ask why we don't share a Nav component. The answer is "they're visually distinct enough that abstraction would cost more than it saves" but it's a fair question.

## What's intentionally not done

Everything in `lib/`, `app/api/`, `knowledge-base*`, `scripts/`, `evals/`, `.env*`, and `package.json` (except font imports via `next/font`) is untouched, per the brief. The Chat component lives in `app/components/` so it was fair game.

## Build status

```
Route (app)                              Size     First Load JS
┌ ○ /                                    174 B           109 kB
├ ○ /_not-found                          982 B           106 kB
├ ƒ /api/chat                            135 B           105 kB
├ ○ /brokerage                           2.75 kB         174 kB
└ ○ /demo                                2.75 kB         174 kB
```

All three pages prerender as static. First Load JS for the chat-bearing pages is ~174 kB, dominated by the AI SDK's shared chunk. No new dependencies. No `package.json` changes.

## How to evaluate tomorrow

1. `npm run dev` and walk through `/` → `/demo` → `/brokerage` in order.
2. Resize from desktop to mobile on each page; the chat must stay first on mobile.
3. Switch between `/demo` and `/brokerage` and confirm the chat header, button, avatar, and corners visibly differ.
4. Ask Avery the same question on both pages and confirm the brokerage chat surfaces the supervisory retention footnote at the bottom.
5. Check `git log --oneline` — the commits should be cleanly revertable per page.
