const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();

// Import auth strategy
require('./auth/google');

// Import routes
const authRoutes = require('./routes/auth');
const systemRoutes = require('./routes/systems');
const foundationRoutes = require('./routes/foundations');
const componentRoutes = require('./routes/components');
const tokenRoutes = require('./routes/tokens');
const docRoutes = require('./routes/docs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://localhost:5174',
        'http://localhost:5001', // Add the new frontend port
        process.env.FRONTEND_URL
      ].filter(Boolean), // Support multiple dev servers and remove undefined values
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/systems', systemRoutes);
app.use('/api/foundations', foundationRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/docs', docRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Design System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
