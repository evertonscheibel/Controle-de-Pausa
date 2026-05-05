const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5180',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes Placeholder
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), service: 'Bridge PauseControl API' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const operacaoRoutes = require('./routes/operacao.routes');
const colaboradoresRoutes = require('./routes/colaboradores.routes');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/operacao', operacaoRoutes);
app.use('/api/v1/colaboradores', colaboradoresRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

module.exports = app;
