const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // strict for login/register
  message: { error: 'Too many auth attempts, please try again later' }
});

const exportLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Export limit reached, please try again later' }
});

module.exports = { generalLimiter, authLimiter, exportLimiter };