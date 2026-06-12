const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase, supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authLimiter, [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('display_name').trim().isLength({ min: 2, max: 60 }).escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, display_name } = req.body;

  const signUpResult = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name },
      emailRedirectTo: `${process.env.CORS_ORIGIN}/auth/verify`
    }
  });

  if (signUpResult.error) {
    return res.status(400).json({ error: signUpResult.error.message });
  }

  const data = signUpResult.data;

  res.status(201).json({
    message: 'Registration successful. Please verify your email.',
    user: { id: data.user?.id, email: data.user?.email }
  });
});

// POST /api/auth/login
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: { id: data.user.id, email: data.user.email }
  });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  await supabase.auth.admin.signOut(token);
  res.json({ message: 'Logged out' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false })
], async (req, res) => {
  const { email } = req.body;
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.CORS_ORIGIN}/auth/reset-password`
  });
  // Always return success — never reveal if email exists (prevents enumeration)
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// POST /api/auth/reset-password
router.post('/reset-password', requireAuth, [
  body('new_password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { new_password } = req.body;

  const { error } = await supabase.auth.updateUser({ password: new_password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Password updated successfully' });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id, email, phone, display_name, role, created_at')
    .eq('id', req.userId)
    .single();

  if (error) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

module.exports = router;
