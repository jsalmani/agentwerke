/**
 * Avery's tool definitions.
 *
 * Each tool has a Zod schema (parameter validation), a description (Claude reads
 * this to decide when to use the tool), and an execute function (the actual work).
 * The Vercel AI SDK plumbs all of this into Claude's tool-use loop automatically.
 *
 * Five tools, in order of how often they fire:
 *   getAvailableSlots     — show calendar slots
 *   bookDiscoveryCall     — confirm booking
 *   captureLead           — capture contact info for someone not ready to book
 *   handoffToHuman        — alert founder for cases beyond Avery's scope
 *
 * Each tool's execute fn is wrapped in instrumented() which times the call,
 * logs it to the tool_calls table for audit, and converts thrown errors into
 * structured error responses the model can recover from.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { getAvailableSlots, createBooking } from './calcom';
import { notifyFounder, sendAttendeeConfirmation } from './email';
import { logToolCall, upsertLead, updateSessionStatus } from './supabase';

async function instrumented<TIn extends object, TOut>(
  toolName: string,
  sessionId: string,
  input: TIn,
  fn: (input: TIn) => Promise<TOut>
): Promise<TOut | { error: true; message: string }> {
  const t0 = Date.now();
  try {
    const output = await fn(input);
    await logToolCall({
      sessionId,
      toolName,
      input,
      output,
      durationMs: Date.now() - t0,
      succeeded: true,
    });
    return output;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logToolCall({
      sessionId,
      toolName,
      input,
      output: null,
      durationMs: Date.now() - t0,
      succeeded: false,
      error: message,
    });
    return {
      error: true,
      message: `${toolName} failed: ${message}. Tell the visitor there was a hiccup and offer to take their email instead.`,
    };
  }
}

/**
 * Build the toolset for a given session. We close over sessionId so each
 * tool's audit log knows which conversation it belongs to.
 */
export function buildTools(sessionId: string) {
  return {
    getAvailableSlots: tool({
      description:
        "Get available 30-minute discovery call slots on Jason's Cal.com calendar. " +
        'Use this when the visitor wants to book a call. Pass a small number of days ' +
        'ahead (3-14 is the sweet spot — too long and the list overwhelms).',
      inputSchema: z.object({
        daysAhead: z
          .number()
          .int()
          .min(1)
          .max(30)
          .describe('Number of days into the future to search for slots. Default 7.'),
      }),
      execute: async (input) =>
        instrumented('getAvailableSlots', sessionId, input, async ({ daysAhead }) => {
          const slots = await getAvailableSlots(daysAhead);
          const limited = slots.slice(0, 8); // Don't overwhelm the model with options
          return {
            slotsFound: limited.length,
            totalAvailable: slots.length,
            slots: limited.map((s) => ({
              start: s.start,
              end: s.end,
              humanReadable: new Date(s.start).toLocaleString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short',
                timeZone: 'America/New_York',
              }),
            })),
          };
        }),
    }),

    bookDiscoveryCall: tool({
      description:
        "Book a confirmed 30-minute discovery call on Jason's calendar. " +
        'IMPORTANT: only call this after the visitor has explicitly confirmed a specific ' +
        'time slot AND given you their name and email. Never book without explicit confirmation.',
      inputSchema: z.object({
        startTime: z
          .string()
          .describe('ISO 8601 timestamp of the slot start, copied from getAvailableSlots output.'),
        name: z.string().min(1).describe("Visitor's full name."),
        email: z.string().email().describe("Visitor's email address."),
        notes: z
          .string()
          .optional()
          .describe(
            'Optional one-paragraph summary of what the visitor wants to discuss, ' +
              'so Jason has context before the call.'
          ),
      }),
      execute: async (input) =>
        instrumented('bookDiscoveryCall', sessionId, input, async ({ startTime, name, email, notes }) => {
          const booking = await createBooking({
            startTime,
            attendeeName: name,
            attendeeEmail: email,
            notes,
          });
          const humanTime = new Date(booking.startTime).toLocaleString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: 'America/New_York',
          });
          // Side effects: lead, session status, founder notification, branded confirmation.
          await Promise.all([
            upsertLead({
              sessionId,
              name,
              email,
              reason: notes,
              bookingId: booking.id,
              bookingTime: booking.startTime,
              status: 'booked',
            }),
            updateSessionStatus(sessionId, 'booked'),
            notifyFounder({
              subject: `New discovery call booked: ${name}`,
              body:
                `Avery just booked a discovery call.\n\n` +
                `Who: ${name} <${email}>\n` +
                `When: ${humanTime}\n` +
                `Cal.com booking ID: ${booking.uid}\n\n` +
                (notes ? `Context they shared: ${notes}` : 'No context shared yet.'),
            }),
            sendAttendeeConfirmation({
              toEmail: email,
              toName: name,
              meetingTime: humanTime,
              meetingUrl: booking.meetingUrl,
            }).catch((err) => console.error('Attendee confirmation failed (non-fatal):', err)),
          ]);
          return {
            booked: true,
            bookingId: booking.uid,
            startTime: booking.startTime,
            humanReadableTime: humanTime,
            meetingUrl: booking.meetingUrl,
            message: `Booked. ${name} should expect a Cal.com calendar invite plus a separate note from Jason within the next minute.`,
          };
        }),
    }),

    captureLead: tool({
      description:
        'Capture contact information for a visitor who is interested but not ready to book a call. ' +
        "ALWAYS ask the visitor's permission before capturing their email. " +
        'Use this for: "I\'m not ready to book yet but I\'d love to hear more later", ' +
        'visitors who are researching for a future engagement, or anyone who explicitly ' +
        'asks to be added to a follow-up list.',
      inputSchema: z.object({
        email: z.string().email(),
        name: z.string().optional(),
        reason: z
          .string()
          .describe("Brief note on what they're interested in or why they're not booking now."),
      }),
      execute: async (input) =>
        instrumented('captureLead', sessionId, input, async ({ email, name, reason }) => {
          await Promise.all([
            upsertLead({ sessionId, name, email, reason, status: 'lead' }),
            updateSessionStatus(sessionId, 'lead_captured'),
            notifyFounder({
              subject: `New lead captured: ${name || email}`,
              body:
                `Avery captured a lead.\n\n` +
                `Who: ${name || '(no name given)'} <${email}>\n` +
                `Why: ${reason}`,
            }),
          ]);
          return {
            captured: true,
            message: 'Got it — Jason will follow up. Thanks for letting me grab your info.',
          };
        }),
    }),

    handoffToHuman: tool({
      description:
        'Alert Jason that this conversation needs human follow-up. Use when: ' +
        '(a) the visitor asks something outside your competence (custom integrations, ' +
        'complex pricing, legal/compliance questionnaires), ' +
        '(b) the visitor explicitly asks to talk to a human, ' +
        '(c) the conversation indicates a high-value opportunity that should not wait. ' +
        "After calling this, tell the visitor what you've done and ask for their email so Jason can follow up.",
      inputSchema: z.object({
        reason: z.string().describe("One-paragraph summary of why this needs Jason's attention."),
        urgency: z
          .enum(['low', 'medium', 'high'])
          .describe(
            'low = informational, medium = follow up within a day, high = same-day attention recommended'
          ),
      }),
      execute: async (input) =>
        instrumented('handoffToHuman', sessionId, input, async ({ reason, urgency }) => {
          await notifyFounder({
            subject: `[${urgency.toUpperCase()}] Avery needs you on a conversation`,
            body:
              `Avery is escalating a conversation.\n\n` +
              `Urgency: ${urgency}\n` +
              `Reason: ${reason}\n\n` +
              `Pull up the conversation in the leads pipeline (Supabase > pipeline view) ` +
              `to see the full transcript.`,
          });
          return {
            handed_off: true,
            message: 'Flagged for Jason. Want me to also grab your email so he can reach out directly?',
          };
        }),
    }),
  };
}

export type AveryTools = ReturnType<typeof buildTools>;
