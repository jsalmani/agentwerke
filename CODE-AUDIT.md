# Code audit — `lib/tools.ts`, `lib/calcom.ts`, `lib/email.ts`, `lib/supabase.ts`

A read-only review of the four files. Findings only — no modifications.

Severity: **HIGH** = real bug that can hit production users, **MED** = correctness or attribution bug under realistic load, **LOW** = correctness in edge cases or operational hygiene.

---

## HIGH-1 — HTML injection in founder + attendee emails

**Files:** `lib/email.ts:48-57`, `lib/email.ts:83-106`
**Trigger:** any user-supplied string (`name`, `email`, `notes`) reaches an email body.

`notifyFounder` builds HTML by string concatenation:

```ts
<p>${input.body.replace(/\n/g, '<br/>')}</p>
```

`input.body` is built upstream in `tools.ts:154-160` as:

```ts
body:
  `Avery just booked a discovery call.\n\n` +
  `Who: ${name} <${email}>\n` +
  `When: ${humanTime}\n` +
  `Cal.com booking ID: ${booking.uid}\n\n` +
  (notes ? `Context they shared: ${notes}` : 'No context shared yet.')
```

If a visitor sets their `notes` (or `name`) to anything containing `<` or `>`, that goes straight into the founder's email HTML — including `<script>` (most clients sandbox this, so the practical risk is HTML/CSS injection that breaks formatting or smuggles trackers, not RCE) and `<img src=x onerror=…>` style payloads against any client that does render scripts.

`sendAttendeeConfirmation` has the same shape: `input.toName.split(' ')[0]` is interpolated unescaped, and `name` is collected from the visitor without sanitization (`tools.ts:113-114`).

**Fix:** HTML-escape every interpolated user value before it goes into the HTML branch. Either use a tiny `escapeHtml(s)` helper or migrate to a templating library that escapes by default. The plain-text `text:` branch on `notifyFounder` is fine — keep it.

---

## HIGH-2 — Post-booking side-effect failure causes the model to think the booking failed

**File:** `lib/tools.ts:140-167`

`bookDiscoveryCall.execute` does:

```ts
const booking = await createBooking(...);   // (1) Cal.com booking succeeds
await Promise.all([
  upsertLead(...),                           // (2)
  updateSessionStatus(...),                  // (3)
  notifyFounder(...),                        // (4)  ← can throw
  sendAttendeeConfirmation(...).catch(...),  // (5)  ← already wrapped
]);
return { booked: true, ... };
```

If any of (2), (3), or (4) rejects, the surrounding `instrumented()` wrapper catches the error and returns:

```ts
{ error: true, message: `bookDiscoveryCall failed: …. Tell the visitor there was a hiccup and offer to take their email instead.` }
```

…to the model. **But Cal.com already booked the call.** The model dutifully apologizes and may attempt to re-book, creating a duplicate. The visitor receives a Cal.com confirmation email anyway and is left confused.

This is the most user-visible bug in the file.

**Fix:** Treat post-booking side effects as best-effort. Wrap each in its own `.catch` that logs but does not propagate. The booking is the source of truth; logging/notification failures should not poison the model's worldview. Suggested shape:

```ts
const sideEffects = await Promise.allSettled([upsertLead(...), updateSessionStatus(...), notifyFounder(...), sendAttendeeConfirmation(...)]);
sideEffects.forEach((r, i) => { if (r.status === 'rejected') console.error('post-booking side effect failed', i, r.reason); });
return { booked: true, ... };
```

The same pattern applies (with lower stakes) in `captureLead.execute` (`tools.ts:194-205`) — `notifyFounder` can fail and convince the model the lead wasn't captured when it was.

---

## HIGH-3 — `meetingUrl` is collected and silently dropped

**Files:** `lib/tools.ts:165-166`, `lib/email.ts:75-114`

`sendAttendeeConfirmation` accepts `meetingUrl?: string` but never references it in the email body. The current copy says:

> "You'll get a separate calendar invite from Cal.com — that's the official confirmation with the meeting link."

…which is correct as a fallback, but if Cal.com returns a `meetingUrl` (it does for events that auto-generate Zoom/Google Meet links), the agent has the link in hand and discards it. Visitors who delete the Cal.com email by mistake have to dig for the link.

**Fix:** If `meetingUrl` is present, render it as a labeled link in the email body. Cheap win.

---

## MED-1 — Hardcoded `America/New_York` for both slot display and booking

**Files:** `lib/tools.ts:91-98`, `lib/tools.ts:131-138`, `lib/calcom.ts:78-79`, `lib/calcom.ts:150`

Slots are formatted with `timeZone: 'America/New_York'` regardless of the visitor's actual timezone. A visitor in Pacific time sees "10am EST" and might book what they think is 10am their time. The booking itself defaults the attendee's timezone to ET (`calcom.ts:150`), so the Cal.com confirmation will also display ET times.

**Fix:** Either (a) accept the visitor's IANA timezone as an input (browser can pass `Intl.DateTimeFormat().resolvedOptions().timeZone` from the chat client and the API echoes it through), or (b) explicitly label the time as "Eastern Time" in the human-readable string — which is already happening via `timeZoneName: 'short'`, but the agent's narrative around it ("Tuesday at 10am") often drops the suffix.

The cheapest correctness fix is to surface the timezone from the visitor's locale once at session start and thread it through to both `getAvailableSlots` and `createBooking`.

---

## MED-2 — `upsertLead` overwrites `session_id` on email collision

**File:** `lib/supabase.ts:135-148`

`onConflict: 'email'` means: if the same person comes back to the site, books, then comes back later and books again, the second session's `session_id` overwrites the first on the leads row. Multi-touch attribution is lost — the founder's pipeline view will only show the latest session, even though the visitor's full journey is across two sessions.

**Fix:** Either (a) keep a single denormalized `latest_session_id` plus a separate `lead_sessions` join table, or (b) make the leads row immutable on insert and write subsequent touches to a `lead_events` audit table.

Lower-stakes alternative: at minimum, set `session_id = COALESCE(leads.session_id, EXCLUDED.session_id)` so the *first* session is preserved. This requires writing the upsert as raw SQL or moving to a function — Supabase's JS client doesn't expose `EXCLUDED` directly via `upsert()`.

---

## MED-3 — Silent founder-notification skip if `FOUNDER_EMAIL` unset

**File:** `lib/email.ts:42-46`

```ts
if (!FOUNDER_EMAIL) {
  console.warn('FOUNDER_EMAIL not set — skipping founder notification');
  return;
}
```

On Vercel, `console.warn` goes to runtime logs that nobody is watching. If `FOUNDER_EMAIL` is unset (e.g., a Vercel env var missed during deploy), bookings will succeed silently and the founder will never be notified. The first sign of the bug is a "we never got back to that lead" complaint days later.

**Fix:** Either fail loud (`throw` if unset and the function is called) so the deploy gates on it, or surface a `degraded: true` flag on the tool's return value so observability can alert.

---

## MED-4 — Subject line identical for every attendee confirmation

**File:** `lib/email.ts:111`

```ts
subject: `Looking forward to our call`,
```

Gmail/Outlook will thread these. A visitor who books, cancels, and rebooks ends up with one thread containing three "Looking forward to our call" emails — the most recent one wins visually but the older ones aren't archived. Worse, if Avery sends a follow-up confirmation later, it threads with the original and looks like a stale resend.

**Fix:** Include the booking time or booking ID in the subject. `Looking forward to ${humanTime}` is cheap and defensible.

---

## LOW-1 — `bookingFieldsResponses: { notes }` may silently no-op

**File:** `lib/calcom.ts:156-158`

Cal.com v2 expects `bookingFieldsResponses` to be a map keyed by the **field's slug** as configured on the event type. If the event type doesn't have a field with the slug `notes`, the body of the booking won't carry the visitor's context, and Cal.com will silently accept the booking without the notes. The agent's `notes` parameter (`tools.ts:115`) is collected with intent but quietly discarded.

**Fix:** Verify the event-type's actual field slug at deploy time (one-off `curl` of `/v2/event-types`) and either rename to match or document the constraint. A defensive option is to also write `notes` into the booking's top-level `description` if Cal.com supports it on this version.

---

## MED-5 — `/v2/slots` query has no explicit pagination parameter (unverified, unmitigated)

**File:** `lib/calcom.ts:75-89`

The slots GET sends `eventTypeId`, `start`, `end`, and `timeZone` and nothing else. Cal.com's v2 list endpoints support `take` (max 1000) and a cursor for the long-tail case, but with neither supplied we are trusting whatever default the endpoint applies. With the per-day sampler in `tools.ts` now in front of this, upstream silent truncation would be especially insidious: the sampler would happily pick "a representative slot" out of a list that had already been clipped, laundering hidden data loss into apparent variety.

**Attempted mitigation (reverted):** A prior change (commit `49a45ee`, reverted) added `take=100` to the query on the assumption that `/v2/slots` followed the same list-endpoint convention as other v2 endpoints. A live request returned HTTP 400 with `property take should not exist` — `/v2/slots` rejects `take` outright. The `take=100` parameter is not a valid mitigation here and has been removed.

**Still open:**

- The underlying question — does `/v2/slots` silently truncate, and if so at what limit, and is there a cursor or alternative pagination knob? — remains unverified. The shape of the response and any nextCursor / hasMore semantics need to be confirmed against Cal.com's published v2 docs or by asking Cal.com support directly, since the v2 list-endpoint conventions clearly do not apply uniformly to `/v2/slots`.
- Until that is resolved, the per-day sampler in `tools.ts` is operating on an upstream list of unknown completeness. Treat this as an open tripwire.

The proper fix is to (a) consult Cal.com docs/support for `/v2/slots`-specific pagination semantics, then (b) implement whatever the correct cursor / page mechanism is in `getAvailableSlots`. Do not re-add `take` without first confirming via the docs that the endpoint accepts it.

## LOW-2 — Duplicate API key check + version drift in `calcom.ts`

**File:** `lib/calcom.ts:82-89`

`getAvailableSlots` bypasses the shared `calFetch` helper because the slots endpoint requires API version `2024-09-04` while the helper hardcodes `2024-08-13`. The result is a duplicated `apiKey` check and two parallel error-handling paths.

**Fix:** Lift API version into a parameter on `calFetch` (`{ apiVersion?: string } = '2024-08-13'`) and route `getAvailableSlots` through it. Reduces drift and consolidates auth. Not a bug, but a maintenance hazard the next time Cal.com bumps versions.

---

## LOW-3 — `instrumented()` returns a structured-error string the model is asked to act on

**File:** `lib/tools.ts:54-57`

```ts
return {
  error: true,
  message: `${toolName} failed: ${message}. Tell the visitor there was a hiccup and offer to take their email instead.`,
};
```

The instructional clause inside `message` is doing prompt-engineering at the tool-result layer, which is fine in spirit but couples the recovery instruction to the tool definition. A cleaner separation: return `{ error: true, code: 'TOOL_FAILED', detail: message }` and let the system prompt own the recovery instruction. Today's pattern works; flagging because if someone changes the recovery copy in `system-prompt.ts`, this string will silently disagree.

---

## LOW-4 — `getAvailableSlots` `.slice(0, 8)` drops slots without surfacing why

**File:** `lib/tools.ts:83-85`

Returns `slotsFound` and `totalAvailable` but not which 8 were chosen. The model gets the first 8 by `.localeCompare()` order, which is chronological, which is fine — but if the visitor says "anything later in the day works better" and the first 8 are all morning, the model will offer mornings only. The fix is small (sample across the day, or expose the time-of-day distribution) but worth flagging.

---

## What I deliberately did not flag

- The `console.error('Failed to log message:', error); // non-fatal` pattern in `supabase.ts:98` and `121`. This is intentional and correct — the audit trail being lossy under DB failure is the right trade-off vs. failing user-visible chat.
- `getSupabase()`'s lazy-singleton pattern. Standard, no issue.
- The Resend null-check pattern (`resend!`) — `assertResendConfigured()` makes the non-null assertion safe.

---

## Suggested fix order

1. **HIGH-2** (booking-atomicity) — highest user-visible severity, cheapest to fix.
2. **HIGH-1** (HTML injection) — security-flavored even if the practical exploit is narrow.
3. **HIGH-3** (`meetingUrl` dropped) — one-line copy change.
4. **MED-1** (timezone) — one of those bugs that will eventually generate an angry email; fix before the first non-Eastern visitor.
5. The rest as time allows.
