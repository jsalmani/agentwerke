/**
 * Cal.com v2 API client.
 *
 * Wraps the two endpoints we need:
 *  - GET /v2/slots — list available booking slots
 *  - POST /v2/bookings — create a booking
 *
 * Docs: https://cal.com/docs/api-reference/v2/introduction
 *
 * Auth: API key in Authorization header.
 *
 * Note on event types: Cal.com bookings are tied to a specific "event type"
 * (a 30-min discovery call, a 60-min consultation, etc.). We use the slug
 * configured in env vars. To find your event type ID, hit:
 *   GET https://api.cal.com/v2/event-types
 * with your API key.
 */

const CAL_API_BASE = 'https://api.cal.com/v2';

interface CalApiError extends Error {
  status?: number;
  body?: unknown;
}

async function calFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.CALCOM_API_KEY;
  if (!apiKey) {
    throw new Error('CALCOM_API_KEY is not set');
  }

  const res = await fetch(`${CAL_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'cal-api-version': '2024-08-13',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Cal.com API ${res.status}: ${body}`) as CalApiError;
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return res.json() as Promise<T>;
}

export interface AvailableSlot {
  start: string; // ISO 8601 in UTC
  end: string;
}

/**
 * Get available slots for the next N days for the configured event type.
 *
 * Returns a flat array of {start, end} ISO timestamps.
 */
export async function getAvailableSlots(daysAhead: number = 14): Promise<AvailableSlot[]> {
  const eventTypeSlug = process.env.CALCOM_EVENT_TYPE_SLUG || 'discovery-call';
  const username = process.env.CALCOM_USERNAME;
  if (!username) {
    throw new Error('CALCOM_USERNAME is not set');
  }

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    eventTypeSlug,
    username,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  });

  const data = await calFetch<{
    status: string;
    data: Record<string, Array<{ start: string; end?: string }>>;
  }>(`/slots?${params.toString()}`);

  // Cal.com returns slots grouped by date. Flatten to a single list and add `end`
  // (assume 30-min slots if end is missing).
  const slots: AvailableSlot[] = [];
  for (const dateKey of Object.keys(data.data)) {
    for (const slot of data.data[dateKey]) {
      const start = slot.start;
      const end = slot.end || new Date(new Date(start).getTime() + 30 * 60 * 1000).toISOString();
      slots.push({ start, end });
    }
  }

  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

export interface BookingResult {
  id: number;
  uid: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  status: string;
}

/**
 * Book a discovery call.
 *
 * Cal.com handles confirmation emails to both attendee and host automatically
 * once a booking is created. We don't duplicate that with Resend — the Cal
 * email is the source of truth for the meeting itself. We only send a
 * separate Resend email if we want to add Agentwerke-branded follow-up content.
 */
export async function createBooking(input: {
  startTime: string; // ISO 8601
  attendeeName: string;
  attendeeEmail: string;
  notes?: string;
  timeZone?: string;
}): Promise<BookingResult> {
  const eventTypeId = process.env.CALCOM_EVENT_TYPE_ID;
  if (!eventTypeId) {
    throw new Error('CALCOM_EVENT_TYPE_ID is not set — find it via GET /v2/event-types');
  }

  const body = {
    eventTypeId: Number(eventTypeId),
    start: input.startTime,
    attendee: {
      name: input.attendeeName,
      email: input.attendeeEmail,
      timeZone: input.timeZone || 'America/New_York',
      language: 'en',
    },
    metadata: {
      source: 'avery-agent',
    },
    bookingFieldsResponses: input.notes
      ? { notes: input.notes }
      : undefined,
  };

  const data = await calFetch<{
    status: string;
    data: {
      id: number;
      uid: string;
      start: string;
      end: string;
      meetingUrl?: string;
      status: string;
    };
  }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return {
    id: data.data.id,
    uid: data.data.uid,
    startTime: data.data.start,
    endTime: data.data.end,
    meetingUrl: data.data.meetingUrl,
    status: data.data.status,
  };
}
