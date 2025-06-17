const express = require('express');
const passport = require('passport');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    const frontendURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-domain.com' 
      : 'http://localhost:3000';
    res.redirect(`${frontendURL}/dashboard`);
  }
);

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({ 
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null
  });
});

module.exports = router;
