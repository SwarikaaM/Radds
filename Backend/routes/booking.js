const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const zoho = require('../services/zoho');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const SLOT_DURATION_MINUTES = 60;
const WORKING_HOURS = { start: 10, end: 17 }; // 10am to 5pm
const WORKING_DAYS = [1, 2, 3, 4, 5]; // Mon-Fri

function generateSlots(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay();
  if (!WORKING_DAYS.includes(day)) return [];

  const slots = [];
  for (let h = WORKING_HOURS.start; h < WORKING_HOURS.end; h++) {
    const start = new Date(date);
    start.setHours(h, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + SLOT_DURATION_MINUTES);
    if (end.getHours() <= WORKING_HOURS.end) {
      slots.push({ start: start.toISOString(), end: end.toISOString() });
    }
  }
  return slots;
}

// GET /api/booking/blocked-slots?month=2025-07
router.get('/blocked-slots', [
  query('month').matches(/^\d{4}-\d{2}$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const [year, month] = req.query.month.split('-');
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${String(parseInt(month) + 1).padStart(2,'0')}-01`;

  const { data, error } = await supabaseAdmin
    .from('consultation_blocked_slots')
    .select('block_date, start_time, end_time, is_full_day')
    .gte('block_date', startDate)
    .lt('block_date', endDate);

  if (error) return res.status(500).json({ error: 'Failed to fetch blocked slots' });
  res.json(data || []);
});

// GET /api/booking/available-slots?date=2025-07-10
router.get('/available-slots', [
  query('date').isISO8601().isLength({ min: 10, max: 10 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const dateStr = req.query.date;
  const allSlots = generateSlots(dateStr);

  if (!allSlots.length) return res.json([]);

  // Get confirmed bookings for this date
  const { data: bookings } = await supabaseAdmin
    .from('consultation_bookings')
    .select('scheduled_start_at, scheduled_end_at')
    .gte('scheduled_start_at', `${dateStr}T00:00:00Z`)
    .lt('scheduled_start_at', `${dateStr}T23:59:59Z`)
    .in('status', ['confirmed', 'pending']);

  // Get blocked slots for this date
  const { data: blocked } = await supabaseAdmin
    .from('consultation_blocked_slots')
    .select('*')
    .eq('block_date', dateStr);

  const isFullDayBlocked = blocked?.some(b => b.is_full_day);
  if (isFullDayBlocked) return res.json([]);

  // Filter out booked and blocked slots
  const bookedStarts = new Set((bookings || []).map(b => b.scheduled_start_at));

  const blockedRanges = (blocked || []).filter(b => !b.is_full_day);

  const available = allSlots.filter(slot => {
    if (bookedStarts.has(slot.start)) return false;

    // Check against Zoho (stub — returns true when Zoho not active)
    const slotHour = new Date(slot.start).getHours();
    const blockedByRange = blockedRanges.some(b => {
      const bStart = parseInt(b.start_time?.split(':')[0]);
      const bEnd = parseInt(b.end_time?.split(':')[0]);
      return slotHour >= bStart && slotHour < bEnd;
    });

    return !blockedByRange;
  });

  // Zoho availability check (stub until July)
  const zohoAvailable = await zoho.checkAvailability(dateStr, available);

  res.json(zohoAvailable);
});

// POST /api/booking
router.post('/', authLimiter, [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 10, max: 15 }),
  body('scheduled_start_at').isISO8601(),
  body('scheduled_end_at').isISO8601(),
  body('purpose').optional().trim().isLength({ max: 500 }).escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, phone, scheduled_start_at, scheduled_end_at, purpose } = req.body;

  // Re-verify slot is still available (prevent race condition)
  const dateStr = scheduled_start_at.split('T')[0];
  const { data: existing } = await supabaseAdmin
    .from('consultation_bookings')
    .select('id')
    .eq('scheduled_start_at', scheduled_start_at)
    .in('status', ['confirmed', 'pending'])
    .single();

  if (existing) return res.status(409).json({ error: 'This slot has just been booked. Please choose another.' });

  // Check blocked
  const { data: blocked } = await supabaseAdmin
    .from('consultation_blocked_slots')
    .select('*')
    .eq('block_date', dateStr);

  if (blocked?.some(b => b.is_full_day)) {
    return res.status(409).json({ error: 'This date is not available for bookings.' });
  }

  // Insert booking as pending first
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('consultation_bookings')
    .insert({
      name, email, phone,
      scheduled_start_at, scheduled_end_at,
      purpose,
      status: 'pending',
      requested_at: new Date().toISOString(),
    })
    .select().single();

//   if (bookingError) {
//     if (bookingError.code === '23505') {
//       return res.status(409).json({ error: 'Slot already taken. Please choose another.' });
//     }
//     return res.status(500).json({ error: 'Booking failed' });
//   }

if (bookingError) {
  console.error("SUPABASE INSERT ERROR DETAILS:", bookingError); // 🔍 Add this line!
  if (bookingError.code === '23505') {
    return res.status(409).json({ error: 'Slot already taken. Please choose another.' });
  }
  return res.status(500).json({ error: `Booking failed: ${bookingError.message}` });
}

  // Attempt Zoho event creation (stub until July)
  const zohoResult = await zoho.createEvent({ name, email, phone, scheduled_start_at, scheduled_end_at, purpose });

  if (zohoResult.success) {
    await supabaseAdmin.from('consultation_bookings')
      .update({
        status: 'confirmed',
        zoho_event_id: zohoResult.event_id,
        zoho_event_created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);
  } else {
    // Zoho failed — mark as confirmed anyway (Zoho is stub)
    // In production (July+): mark failed and return error
    await supabaseAdmin.from('consultation_bookings')
      .update({ status: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', booking.id);
  }

  res.status(201).json({
    message: 'Booking confirmed',
    booking_id: booking.id,
    scheduled_start_at,
    scheduled_end_at,
  });
});

// PATCH /api/booking/:id/cancel
router.patch('/:id/cancel', [
  body('email').isEmail().normalizeEmail(), // verify requester owns this booking
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { data: booking } = await supabaseAdmin
    .from('consultation_bookings')
    .select('id, status, email, zoho_event_id')
    .eq('id', req.params.id)
    .eq('email', req.body.email)
    .single();

  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status === 'cancelled') return res.status(400).json({ error: 'Already cancelled' });

  await supabaseAdmin.from('consultation_bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', booking.id);

  // Cancel Zoho event (stub)
  if (booking.zoho_event_id) await zoho.cancelEvent(booking.zoho_event_id);

  res.json({ message: 'Booking cancelled' });
});

module.exports = router;