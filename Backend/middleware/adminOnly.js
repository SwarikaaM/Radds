const { supabaseAdmin } = require('../services/supabase');

module.exports = async function adminOnly(req, res, next) {
  if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('role')
    .eq('id', req.userId)
    .single();

  if (error || !data || !['admin','staff'].includes(data.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};