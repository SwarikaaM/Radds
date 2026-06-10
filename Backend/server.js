require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes     = require('./routes/auth');
const profileRoutes  = require('./routes/profile');
const calcRoutes     = require('./routes/calculators');
const exportRoutes   = require('./routes/exports');
const bookingRoutes  = require('./routes/booking');
const adminRoutes    = require('./routes/admin');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security headers
app.use(helmet());

// CORS — locked to frontend origin
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Body parsing
app.use(express.json({ limit: '2mb' })); // limit prevents large payload attacks

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

// Global rate limiter
app.use(generalLimiter);

// Health check — used by cron-job.org to keep DB alive
app.get('/health', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.KEEPALIVE_SECRET) {
    return res.status(200).json({ status: 'ok' }); // still return ok, just don't ping DB
  }
  try {
    const { supabaseAdmin } = require('./services/supabase');
    await supabaseAdmin.from('user_profiles').select('id').limit(1);
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/profile',    profileRoutes);
app.use('/api/calculators',calcRoutes);
app.use('/api/exports',    exportRoutes);
app.use('/api/booking',    bookingRoutes);
app.use('/api/admin',      adminRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Radds backend running on ${PORT}`));