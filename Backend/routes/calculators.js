const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
// const { calculateSIP } = require('../calculators/sip');
// const { calculateSWP } = require('../calculators/swp');
// const { calculateLumpsum } = require('../calculators/lumpsum');
// const { calculateStepUpSIP } = require('../calculators/stepUpSip');
// const { calculateCostOfDelaySIP } = require('../calculators/costOfDelaySip');
// const { calculateOneTimeInvestment } = require('../calculators/oneTimeInvestment');
const CALCULATORS = require('../calculators');

const router = express.Router();

// const CALCULATORS = {
//   'sip': calculateSIP,
//   'swp': calculateSWP,
//   'lumpsum': calculateLumpsum,
//   'step-up-sip': calculateStepUpSIP,
//   'cost-of-delay-sip': calculateCostOfDelaySIP,
//   'one-time-investment': calculateOneTimeInvestment,
// };

// POST /api/calculators/calculate — public, no auth needed
router.post('/calculate', [
  body('calculator_type').isIn(Object.keys(CALCULATORS)),
  body('inputs').isObject(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { calculator_type, inputs } = req.body;
  try {
    const fn = CALCULATORS[calculator_type];
    const result = fn(inputs);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Invalid inputs: ' + err.message });
  }
});

// POST /api/calculators/save-session — auth required
router.post('/save-session', requireAuth, [
  body('calculator_type').isIn(Object.keys(CALCULATORS)),
  body('inputs').isObject(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { calculator_type, inputs } = req.body;

  // Recalculate server-side — never trust frontend results
  let result;
  try {
    result = CALCULATORS[calculator_type](inputs);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid inputs' });
  }

  // Save session
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('calculator_sessions')
    .insert({ user_id: req.userId, calculator_type, inputs })
    .select().single();

  if (sessionError) return res.status(500).json({ error: 'Failed to save session' });

  // Save results
  await supabaseAdmin.from('calculator_results').insert({
    session_id: session.id,
    user_id: req.userId,
    summary: result.summary,
    yearly_table: result.yearly_table,
    chart_data: result.chart_data,
  });

  res.status(201).json({ session_id: session.id, result });
});

// GET /api/calculators/sessions
router.get('/sessions', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('calculator_sessions')
    .select('id, calculator_type, inputs, created_at')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: 'Failed to fetch sessions' });
  res.json(data);
});

// GET /api/calculators/sessions/:id
router.get('/sessions/:id', requireAuth, [param('id').isUUID()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { data: session } = await supabaseAdmin
    .from('calculator_sessions').select('*')
    .eq('id', req.params.id).eq('user_id', req.userId).single();
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const { data: result } = await supabaseAdmin
    .from('calculator_results').select('*')
    .eq('session_id', req.params.id).single();

  res.json({ session, result });
});

module.exports = router;
