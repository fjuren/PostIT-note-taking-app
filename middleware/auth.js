const User = require('../models/User');

// Ensure user is logged in
async function ensureAuth(req, res, next) {
  // Mock user added for simpler testing purposes
  if (process.env.NODE_ENV === 'test') {
    try {
      const user = await User.findById('507f1f77bcf86cd799439011').populate(
        'userProfile'
      );
      if (!user) return res.status(401).send('Fake test user not found');
      req.user = user;
      return next();
    } catch (err) {
      return next(err);
    }
  }
  // Real authentication for production:
  // recall isAuthenticated comes from passport
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Ensure user is logged out (for routes that should only be accessed when not logged in)
function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    // send user to the dashboard if they're already authed
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = {
  ensureAuth,
  ensureGuest,
};
