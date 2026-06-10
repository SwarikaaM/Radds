// Zoho Calendar integration stub
// Activate July 2026 when paid plan starts
// Set ZOHO_ACTIVE=true in .env to enable

const ZOHO_ACTIVE = process.env.ZOHO_ACTIVE === 'true';

async function getAccessToken() {
  if (!ZOHO_ACTIVE) return null;
  const res = await fetch(`https://accounts.zoho.in/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function checkAvailability(dateStr, slots) {
  if (!ZOHO_ACTIVE) return slots; // stub: return all slots as available
  // TODO July: call Zoho Calendar freebusy API and filter slots
  return slots;
}

async function createEvent({ name, email, phone, scheduled_start_at, scheduled_end_at, purpose }) {
  if (!ZOHO_ACTIVE) return { success: true, event_id: `stub_${Date.now()}` };

  try {
    const token = await getAccessToken();
    const res = await fetch(`https://calendar.zoho.in/api/v1/calendars/${process.env.ZOHO_CALENDAR_UID}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Consultation - ${name}`,
        dateandtime: {
          start: scheduled_start_at,
          end: scheduled_end_at,
          timezone: 'Asia/Kolkata',
        },
        attendees: [{ email }],
        description: `Phone: ${phone}\nPurpose: ${purpose || 'General consultation'}`,
      }),
    });
    const data = await res.json();
    if (data.events?.[0]?.uid) {
      return { success: true, event_id: data.events[0].uid };
    }
    return { success: false };
  } catch (err) {
    console.error('Zoho createEvent error:', err.message);
    return { success: false };
  }
}

async function cancelEvent(eventId) {
  if (!ZOHO_ACTIVE) return;
  try {
    const token = await getAccessToken();
    await fetch(`https://calendar.zoho.in/api/v1/calendars/${process.env.ZOHO_CALENDAR_UID}/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });
  } catch (err) {
    console.error('Zoho cancelEvent error:', err.message);
  }
}

// module.exports = { checkAvailability, createEvent, cancelEvent };
module.exports = {
  checkAvailability: checkAvailability,
  createEvent: createEvent,
  cancelEvent: cancelEvent
};