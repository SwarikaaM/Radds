const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');

const router = express.Router();
router.use(requireAuth);

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

// GET /api/profile — full profile
router.get('/', async (req, res) => {
  const uid = req.userId;
  try {
    const [profileRes, userRes, income, expenses, children, childExpenses, liabilities, investments, insurance, goals] = await Promise.all([
      supabaseAdmin.from('financial_profiles').select('*').eq('user_id', uid).single(),
      supabaseAdmin.from('user_profiles').select('display_name, email, phone').eq('id', uid).single(),
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
      profile: profileRes.data,
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
    console.error('GET /api/profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/profile — upsert financial_profiles top-level fields
router.post('/', [
  body('age').optional({ nullable: true }).isInt({ min: 18, max: 100 }),
  body('risk_preference').optional({ nullable: true }).isIn(['conservative', 'moderate', 'aggressive', '']),
  body('date_of_plan').optional({ nullable: true }).isISO8601(),
  body('sip_amount').optional().isFloat({ min: 0 }),
  body('sip_growth_rate').optional().isFloat({ min: 0, max: 1 }),
  body('sip_start_age').optional().isInt({ min: 1, max: 80 }),
  body('one_time_invest').optional().isFloat({ min: 0 }),
  body('swp_withdrawal').optional().isFloat({ min: 0 }),
  body('swp_corpus').optional().isFloat({ min: 0 }),
  body('swp_growth_rate').optional().isFloat({ min: 0, max: 1 }),
  body('home_loan_amount').optional().isFloat({ min: 0 }),
  body('home_loan_emi').optional().isFloat({ min: 0 }),
  body('home_loan_tenure').optional().isInt({ min: 1, max: 360 }),
  body('home_loan_rate').optional().isFloat({ min: 0, max: 1 }),
  body('term_insurance_premium').optional().isFloat({ min: 0 }),
  body('term_insurance_sip').optional().isFloat({ min: 0 }),
  body('term_insurance_tenure').optional().isInt({ min: 1, max: 40 }),
  body('term_growth_rate').optional().isFloat({ min: 0, max: 1 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const allowed = [
    'age','risk_preference','date_of_plan',
    'sip_amount','sip_growth_rate','sip_start_age','one_time_invest',
    'swp_withdrawal','swp_corpus','swp_growth_rate',
    'home_loan_amount','home_loan_emi','home_loan_tenure','home_loan_rate',
    'term_insurance_premium','term_insurance_sip','term_insurance_tenure','term_growth_rate',
  ];
  const fields = {};
  for (const [k, v] of Object.entries(req.body)) {
    if (allowed.includes(k)) {
      if (v === '' || v === null) fields[k] = null;
      else fields[k] = v;
    }
  }
  const { data, error } = await supabaseAdmin
    .from('financial_profiles')
    .upsert({ user_id: req.userId, ...fields }, { onConflict: 'user_id' })
    .select().single();
  if (error) {
    console.error('POST /api/profile error:', error);
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

// PATCH /api/profile/user — update name, phone directly on user_profiles
// Email changes go through Supabase Auth (requires re-verification) — handled separately
router.patch('/user', [
  body('display_name').optional().trim().isLength({ min: 1, max: 100 }),
  body('phone').optional().trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number'),
], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = {};
  if (req.body.display_name !== undefined) updates.display_name = req.body.display_name;
  if (req.body.phone !== undefined) updates.phone = req.body.phone;
  if (Object.keys(updates).length === 0) return res.json({ message: 'Nothing to update' });

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update(updates)
    .eq('id', req.userId)
    .select('display_name, email, phone')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ── INCOME ──────────────────────────────────────────────────────────
router.post('/income', [
  body('source_type').isIn(['salary','business','rental','investment','other']),
  body('label').trim().isLength({ min: 1, max: 100 }),
  body('amount').isFloat({ min: 0 }),
  body('is_secondary').optional().isBoolean(),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { source_type, label, amount, is_secondary } = req.body;
  const { data, error } = await supabaseAdmin.from('income_sources')
    .insert({ user_id: req.userId, source_type, label, amount, is_secondary: !!is_secondary })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/income/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['source_type','label','amount'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('income_sources')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/income/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('income_sources').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── EXPENSES ─────────────────────────────────────────────────────────
router.post('/expenses', [
  body('category').isIn(['housing','utilities','living','transport','medical','insurance','lifestyle','other']),
  body('label').trim().isLength({ min: 1, max: 100 }),
  body('key').trim().isLength({ min: 1, max: 50 }),
  body('amount').isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { category, label, key, amount } = req.body;
  const { data, error } = await supabaseAdmin.from('expense_items')
    .insert({ user_id: req.userId, category, label, key, amount }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/expenses/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['category','label','key','amount'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('expense_items')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/expenses/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('expense_items').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── CHILDREN ─────────────────────────────────────────────────────────
router.post('/children', [
  body('name').trim().isLength({ min: 1, max: 60 }),
  body('age').isInt({ min: 0, max: 25 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { name, age } = req.body;
  const { data, error } = await supabaseAdmin.from('children')
    .insert({ user_id: req.userId, name, age }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  // Auto-create child_expenses row
  await supabaseAdmin.from('child_expenses')
    .insert({ child_id: data.id, user_id: req.userId, education: 0, allowance: 0, holiday: 0, medical: 0 });
  res.status(201).json(data);
});

router.put('/children/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['name','age'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('children')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.put('/children/:id/expenses', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['education','allowance','holiday','medical'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('child_expenses')
    .update(updates).eq('child_id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data || {});
});

router.delete('/children/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('children').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── LIABILITIES ───────────────────────────────────────────────────────
router.post('/liabilities', [
  body('label').trim().isLength({ min: 1, max: 100 }),
  body('loan_type').isIn(['home','vehicle','personal','education','other']),
  body('outstanding_amount').optional().isFloat({ min: 0 }),
  body('emi').optional().isFloat({ min: 0 }),
  body('interest_rate').optional().isFloat({ min: 0, max: 100 }),
  body('remaining_months').optional().isInt({ min: 0 }),
  body('is_credit_card').optional().isBoolean(),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { label, loan_type, outstanding_amount, emi, interest_rate, remaining_months, is_credit_card } = req.body;
  const { data, error } = await supabaseAdmin.from('liabilities')
    .insert({ user_id: req.userId, label, loan_type, outstanding_amount, emi, interest_rate, remaining_months, is_credit_card: !!is_credit_card })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/liabilities/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['label','loan_type','outstanding_amount','emi','interest_rate','remaining_months','is_credit_card'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('liabilities')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/liabilities/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('liabilities').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── INVESTMENTS ───────────────────────────────────────────────────────
router.post('/investments', [
  body('investment_type').isIn(['mf','stocks','fd','ppf','nps','real_estate','gold','bank','bonds','insurance_cv','other']),
  body('asset_class').optional().isIn(['financial','physical']),
  body('label').trim().isLength({ min: 1, max: 100 }),
  body('current_value').optional().isFloat({ min: 0 }),
  body('monthly_contribution').optional().isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { investment_type, label, current_value, monthly_contribution, asset_class } = req.body;
  const { data, error } = await supabaseAdmin.from('investments')
    .insert({ user_id: req.userId, investment_type, label, current_value, monthly_contribution, asset_class: asset_class || 'financial' })
    .select().single();
  if (error) {
    console.error('POST /investments error:', error);
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

router.put('/investments/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['investment_type','label','current_value','monthly_contribution','asset_class'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('investments')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/investments/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('investments').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── INSURANCE ─────────────────────────────────────────────────────────
router.post('/insurance', [
  body('policy_type').isIn(['life','health','vehicle','term','other']),
  body('provider').optional().trim().isLength({ max: 100 }),
  body('cover_amount').optional().isFloat({ min: 0 }),
  body('premium').optional().isFloat({ min: 0 }),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { policy_type, provider, cover_amount, premium } = req.body;
  const { data, error } = await supabaseAdmin.from('insurance_policies')
    .insert({ user_id: req.userId, policy_type, provider, cover_amount, premium }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/insurance/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ['policy_type','provider','cover_amount','premium'].includes(k))
  );
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('insurance_policies')
    .update(updates).eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/insurance/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('insurance_policies').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── FINANCIAL GOALS ────────────────────────────────────────────────────
router.post('/goals', [
  body('goal_name').trim().isLength({ min: 1, max: 100 }),
  body('target_amount').optional().isFloat({ min: 0 }),
  body('target_year').optional().isInt({ min: 2024, max: 2100 }),
  body('priority').optional().isIn(['high','medium','low']),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { goal_name, target_amount, target_year, priority } = req.body;
  const { data, error } = await supabaseAdmin.from('financial_goals')
    .insert({ user_id: req.userId, goal_name, target_amount, target_year, priority }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete('/goals/:id', [param('id').isUUID()], async (req, res) => {
  if (!validate(req, res)) return;
  await supabaseAdmin.from('financial_goals').delete().eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Deleted' });
});

// ── CONSENT ────────────────────────────────────────────────────────────
router.post('/consent', [
  body('terms_version').notEmpty(),
  body('privacy_version').notEmpty(),
], async (req, res) => {
  if (!validate(req, res)) return;
  const { terms_version, privacy_version } = req.body;
  const { data, error } = await supabaseAdmin.from('consent_acceptances')
    .insert({ user_id: req.userId, terms_version, privacy_version, ip_address: req.ip, user_agent: req.headers['user-agent'] })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ── ACCOUNT DELETION (DPDP) ────────────────────────────────────────────
router.delete('/me', auditLog({ action: 'account.delete', entityType: 'user_profiles' }), async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(req.userId);
  if (error) return res.status(500).json({ error: 'Failed to delete account' });
  res.json({ message: 'Account and all data deleted' });
});

module.exports = router;
