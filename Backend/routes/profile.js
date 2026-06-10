const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');

const router = express.Router();
router.use(requireAuth); // all profile routes require auth

// Helper: send validation errors
function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

// ============================================================
// FINANCIAL PROFILE (top level)
// ============================================================

// GET /api/profile — full profile with all sections
router.get('/', async (req, res) => {
  const uid = req.userId;
  try {
    const [profile, income, expenses, children, childExpenses, liabilities, investments, insurance, goals] = await Promise.all([
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/profile — create financial profile
router.post('/', [
  body('age').optional().isInt({ min: 18, max: 100 }),
  body('risk_preference').optional().isIn(['conservative', 'moderate', 'aggressive']),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { age, risk_preference } = req.body;
  const { data, error } = await supabaseAdmin
    .from('financial_profiles')
    .upsert({ user_id: req.userId, age, risk_preference }, { onConflict: 'user_id' })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH /api/profile — update top-level profile fields
router.patch('/', [
  body('age').optional().isInt({ min: 18, max: 100 }),
  body('risk_preference').optional().isIn(['conservative', 'moderate', 'aggressive']),
], auditLog({ action: 'profile.update', entityType: 'financial_profiles' }), async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['age', 'risk_preference'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('financial_profiles')
    .update(updates)
    .eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ============================================================
// INCOME SOURCES
// ============================================================

router.post('/income', [
  body('source_type').isIn(['salary','business','rental','investment','other']),
  body('label').trim().isLength({ min: 1, max: 100 }).escape(),
  body('amount').isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { source_type, label, amount } = req.body;
  const { data, error } = await supabaseAdmin.from('income_sources')
    .insert({ user_id: req.userId, source_type, label, amount })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/income/:id', [
  param('id').isUUID(),
  body('amount').optional().isFloat({ min: 0 }),
  body('label').optional().trim().isLength({ min: 1, max: 100 }).escape(),
], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['source_type','label','amount'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('income_sources')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/income/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('income_sources')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// EXPENSE ITEMS
// ============================================================

router.post('/expenses', [
  body('category').isIn(['housing','utilities','living','transport','medical','insurance','lifestyle','other']),
  body('label').trim().isLength({ min: 1, max: 100 }).escape(),
  body('key').trim().isLength({ min: 1, max: 50 }).escape(),
  body('amount').isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { category, label, key, amount } = req.body;
  const { data, error } = await supabaseAdmin.from('expense_items')
    .insert({ user_id: req.userId, category, label, key, amount })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/expenses/:id', [
  param('id').isUUID(),
  body('amount').optional().isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['category','label','key','amount'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('expense_items')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/expenses/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('expense_items')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// CHILDREN
// ============================================================

router.post('/children', [
  body('name').trim().isLength({ min: 1, max: 60 }).escape(),
  body('age').isInt({ min: 0, max: 25 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { name, age } = req.body;
  const { data, error } = await supabaseAdmin.from('children')
    .insert({ user_id: req.userId, name, age }).select().single();
  if (error) return res.status(400).json({ error: error.message });

  // auto-create child_expenses row
  await supabaseAdmin.from('child_expenses')
    .insert({ child_id: data.id, user_id: req.userId, education: 0, allowance: 0, holiday: 0, medical: 0 });

  res.status(201).json(data);
});

router.put('/children/:id', [
  param('id').isUUID(),
  body('name').optional().trim().isLength({ min: 1, max: 60 }).escape(),
  body('age').optional().isInt({ min: 0, max: 25 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['name','age'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('children')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.put('/children/:id/expenses', [
  param('id').isUUID(),
  body('education').optional().isFloat({ min: 0 }),
  body('allowance').optional().isFloat({ min: 0 }),
  body('holiday').optional().isFloat({ min: 0 }),
  body('medical').optional().isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['education','allowance','holiday','medical'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('child_expenses')
    .update(updates).eq('child_id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/children/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('children')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// LIABILITIES
// ============================================================

router.post('/liabilities', [
  body('label').trim().isLength({ min: 1, max: 100 }).escape(),
  body('loan_type').isIn(['home','vehicle','personal','education','other']),
  body('outstanding_amount').optional().isFloat({ min: 0 }),
  body('emi').optional().isFloat({ min: 0 }),
  body('interest_rate').optional().isFloat({ min: 0, max: 100 }),
  body('remaining_months').optional().isInt({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { label, loan_type, outstanding_amount, emi, interest_rate, remaining_months } = req.body;
  const { data, error } = await supabaseAdmin.from('liabilities')
    .insert({ user_id: req.userId, label, loan_type, outstanding_amount, emi, interest_rate, remaining_months })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/liabilities/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['label','loan_type','outstanding_amount','emi','interest_rate','remaining_months'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('liabilities')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/liabilities/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('liabilities')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// INVESTMENTS
// ============================================================

router.post('/investments', [
  body('investment_type').isIn(['mf','stocks','fd','ppf','nps','real_estate','gold','other']),
  body('label').trim().isLength({ min: 1, max: 100 }).escape(),
  body('current_value').optional().isFloat({ min: 0 }),
  body('monthly_contribution').optional().isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { investment_type, label, current_value, monthly_contribution } = req.body;
  const { data, error } = await supabaseAdmin.from('investments')
    .insert({ user_id: req.userId, investment_type, label, current_value, monthly_contribution })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/investments/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['investment_type','label','current_value','monthly_contribution'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('investments')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/investments/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('investments')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// INSURANCE
// ============================================================

router.post('/insurance', [
  body('policy_type').isIn(['life','health','vehicle','term','other']),
  body('provider').optional().trim().isLength({ max: 100 }).escape(),
  body('cover_amount').optional().isFloat({ min: 0 }),
  body('premium').optional().isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { policy_type, provider, cover_amount, premium } = req.body;
  const { data, error } = await supabaseAdmin.from('insurance_policies')
    .insert({ user_id: req.userId, policy_type, provider, cover_amount, premium })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/insurance/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['policy_type','provider','cover_amount','premium'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('insurance_policies')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/insurance/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('insurance_policies')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// FINANCIAL GOALS
// ============================================================

router.post('/goals', [
  body('goal_name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('target_amount').optional().isFloat({ min: 0 }),
  body('target_year').optional().isInt({ min: 2024, max: 2100 }),
  body('priority').optional().isIn(['high','medium','low']),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { goal_name, target_amount, target_year, priority } = req.body;
  const { data, error } = await supabaseAdmin.from('financial_goals')
    .insert({ user_id: req.userId, goal_name, target_amount, target_year, priority })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/goals/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = ['goal_name','target_amount','target_year','priority'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('financial_goals')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/goals/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const { error } = await supabaseAdmin.from('financial_goals')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ============================================================
// CONSENT (DPDP)
// ============================================================

router.post('/consent', [
  body('terms_version').notEmpty(),
  body('privacy_version').notEmpty(),
  body('terms_accepted').isBoolean().equals('true'),
  body('privacy_accepted').isBoolean().equals('true'),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { terms_version, privacy_version } = req.body;
  const ip = req.ip;
  const ua = req.headers['user-agent'];
  const { data, error } = await supabaseAdmin.from('consent_acceptances')
    .insert({ user_id: req.userId, terms_version, privacy_version, ip_address: ip, user_agent: ua })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ============================================================
// ACCOUNT DELETION (DPDP right to erasure)
// ============================================================

router.delete('/me', auditLog({ action: 'account.delete', entityType: 'user_profiles' }), async (req, res) => {
  const uid = req.userId;
  // Supabase cascade deletes handle all child tables via FK on delete cascade
  const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
  if (error) return res.status(500).json({ error: 'Failed to delete account' });
  res.json({ message: 'Account and all data deleted' });
});

// ============================================================
// SENSITIVE FIELD CHANGE REQUESTS (name)
// ============================================================

router.post('/change-request', [
  body('field_name').isIn(['display_name','phone']),
  body('requested_value').trim().isLength({ min: 1, max: 100 }).escape(),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { field_name, requested_value } = req.body;

  // Get old value
  const { data: profile } = await supabaseAdmin
    .from('user_profiles').select('display_name, phone').eq('id', req.userId).single();

  const old_value = profile?.[field_name] || '';

  const { data, error } = await supabaseAdmin.from('profile_change_requests')
    .insert({ user_id: req.userId, field_name, old_value, requested_value })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Change request submitted', data });
});

module.exports = router;