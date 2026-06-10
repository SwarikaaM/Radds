const { supabaseAdmin } = require('../services/supabase');

function auditLog({ action, entityType, entityId, oldValues, newValues }) {
  return async (req, res, next) => {
    // Run after route completes — attach to res.on('finish')
    res.on('finish', async () => {
      if (res.statusCode >= 400) return; // don't log failed actions
      try {
        await supabaseAdmin.from('audit_logs').insert({
          user_id: req.userId || null,
          action,
          entity_type: entityType,
          entity_id: entityId ? req.params[entityId] : null,
          old_values: oldValues ? res.locals.oldValues : null,
          new_values: newValues ? res.locals.newValues : null,
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        });
      } catch (e) {
        console.error('Audit log failed:', e.message);
        // Never crash the app for audit failure
      }
    });
    next();
  };
}

module.exports = { auditLog };