const express = require('express');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();
router.use(requireAuth, adminOnly); // all admin routes: auth + admin role

// GET /api/admin/users — list all users with profile summary
router.get('/users', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id, email, display_name, phone, role, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return res.status(500).json({ error: 'Failed to fetch users' });
  res.json(data);
});

// GET /api/admin/users/:id — full profile of one user
router.get('/users/:id', [param('id').isUUID()], async (req, res) => {
  const uid = req.params.id;
  const [userRes, profile, income, expenses, children, childExpenses, liabilities, investments, insurance, goals] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('display_name, email, phone').eq('id', uid).single(),
    supabaseAdmin.from('financial_profiles').select('*').eq('user_id', uid).single(),
    supabaseAdmin.from('income_sources').select('*').eq('user_id', uid),
    supabaseAdmin.from('expense_items').select('*').eq('user_id', uid),
    supabaseAdmin.from('children').select('*').eq('user_id', uid),
    supabaseAdmin.from('child_expenses').select('*').eq('user_id', uid),
    supabaseAdmin.from('liabilities').select('*').eq('user_id', uid),
    supabaseAdmin.from('investments').select('*').eq('user_id', uid),
    supabaseAdmin.from('insurance_policies').select('*').eq('user_id', uid),
    supabaseAdmin.from('financial_goals').select('*').eq('user_id', uid),
  ]);
  res.json({
    user: userRes.data,
    profile: profile.data,
    income: income.data || [],
    expenses: expenses.data || [],
    children: children.data || [],
    child_expenses: childExpenses.data || [],
    liabilities: liabilities.data || [],
    investments: investments.data || [],
    insurance: insurance.data || [],
    goals: goals.data || [],
  });
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('consultation_bookings')
    .select('*')
    .order('scheduled_start_at', { ascending: true });
  if (error) return res.status(500).json({ error: 'Failed to fetch bookings' });
  res.json(data);
});

// PATCH /api/admin/bookings/:id
router.patch('/bookings/:id', [param('id').isUUID()], async (req, res) => {
  const allowed = ['status', 'zoho_event_id'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('consultation_bookings')
    .update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/admin/blocked-slots
router.post('/blocked-slots', [
  body('block_date').isISO8601().isLength({ min: 10, max: 10 }),
  body('is_full_day').isBoolean(),
  body('start_time').optional().matches(/^\d{2}:\d{2}$/),
  body('end_time').optional().matches(/^\d{2}:\d{2}$/),
  body('reason').optional().trim().isLength({ max: 200 }).escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { block_date, is_full_day, start_time, end_time, reason } = req.body;
  const { data, error } = await supabaseAdmin
    .from('consultation_blocked_slots')
    .insert({ block_date, is_full_day, start_time, end_time, reason, created_by: req.userId })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/admin/blocked-slots/:id
router.delete('/blocked-slots/:id', [param('id').isUUID()], async (req, res) => {
  const { error } = await supabaseAdmin
    .from('consultation_blocked_slots')
    .delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// GET /api/admin/audit-logs
router.get('/audit-logs', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) return res.status(500).json({ error: 'Failed to fetch audit logs' });
  res.json(data);
});

// GET /api/admin/change-requests
router.get('/change-requests', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profile_change_requests')
    .select('*, user_profiles(display_name, email)')
    .eq('status', 'pending')
    .order('requested_at', { ascending: true });
  if (error) return res.status(500).json({ error: 'Failed' });
  res.json(data);
});

// PATCH /api/admin/change-requests/:id
router.patch('/change-requests/:id', [
  param('id').isUUID(),
  body('action').isIn(['approved', 'rejected']),
  body('review_note').optional().trim().isLength({ max: 300 }).escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { action, review_note } = req.body;

  const { data: cr } = await supabaseAdmin
    .from('profile_change_requests')
    .select('*').eq('id', req.params.id).single();

  if (!cr) return res.status(404).json({ error: 'Not found' });

  // If approved, apply the change to user_profiles
  if (action === 'approved') {
    await supabaseAdmin.from('user_profiles')
      .update({ [cr.field_name]: cr.requested_value, updated_at: new Date().toISOString() })
      .eq('id', cr.user_id);
  }

  await supabaseAdmin.from('profile_change_requests')
    .update({
      status: action,
      reviewed_by: req.userId,
      review_note,
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id);

  res.json({ message: `Request ${action}` });
});

module.exports = router;