/**
 * Resend email helper.
 *
 * Cal.com sends its own confirmation email to the attendee when a booking is
 * created — that's the source of truth for the meeting itself. We use Resend
 * for two additional purposes:
 *
 *   1. A founder notification when a high-intent action happens
 *      (booking created, lead captured, handoff triggered).
 *
 *   2. Optional branded follow-up email to the attendee with extra context
 *      (a one-pager attachment, a "what to expect" note, etc.)
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'avery@agentwerke.com';
const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL;
const AGENCY_NAME = process.env.NEXT_PUBLIC_AGENCY_NAME || 'Agentwerke';
const AGENT_NAME = process.env.NEXT_PUBLIC_AGENT_NAME || 'Avery';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function assertResendConfigured() {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not set');
  }
}

/**
 * Notify the founder when something happens that needs their attention.
 *
 * Use this for: new booking, lead captured, handoff triggered, anything
 * that should hit the founder's inbox in real time.
 */
export async function notifyFounder(input: {
  subject: string;
  body: string; // plain text or simple HTML
  conversationSummary?: string;
}) {
  assertResendConfigured();
  if (!FOUNDER_EMAIL) {
    console.warn('FOUNDER_EMAIL not set — skipping founder notification');
    return;
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; line-height: 1.5;">
      <p>${input.body.replace(/\n/g, '<br/>')}</p>
      ${input.conversationSummary
        ? `<hr/><p style="color: #555; font-size: 14px;"><strong>Conversation summary:</strong><br/>${input.conversationSummary.replace(/\n/g, '<br/>')}</p>`
        : ''}
      <hr/>
      <p style="color: #888; font-size: 12px;">Sent by ${AGENT_NAME} (${AGENCY_NAME} demo agent)</p>
    </div>
  `;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to: FOUNDER_EMAIL,
    subject: input.subject,
    html,
    text: input.body,
  });
}

/**
 * Optional branded confirmation to the attendee.
 *
 * Cal.com already sends the meeting confirmation. This is a separate, more
 * personal touch from Avery — useful for setting expectations and providing
 * pre-call context.
 */
export async function sendAttendeeConfirmation(input: {
  toEmail: string;
  toName: string;
  meetingTime: string; // human-readable
  meetingUrl?: string;
}) {
  assertResendConfigured();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; line-height: 1.6; color: #222;">
      <p>Hi ${input.toName.split(' ')[0]},</p>

      <p>Thanks for booking time with ${AGENCY_NAME}. You'll get a separate calendar invite from Cal.com — that's the official confirmation with the meeting link.</p>

      <p>Quick context for our call ${input.meetingTime}:</p>

      <ul style="padding-left: 20px;">
        <li>30 minutes, casual. No slide deck.</li>
        <li>We'll spend the first 10 minutes on what you're trying to solve, and the rest on whether what we build is a fit.</li>
        <li>If it's not a fit, I'll tell you — and recommend something better.</li>
      </ul>

      <p>If anything changes on your end, just reply to this email or use the reschedule link in the calendar invite.</p>

      <p>Looking forward to it.</p>

      <p>— Jason<br/>${AGENCY_NAME}</p>

      <hr/>
      <p style="color: #888; font-size: 12px;">This email was triggered by ${AGENT_NAME}, the AI agent on our website. ${AGENT_NAME} booked your call and queued this confirmation. Same kind of agent we build for clients.</p>
    </div>
  `;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to: input.toEmail,
    subject: `Looking forward to our call`,
    html,
  });
}
