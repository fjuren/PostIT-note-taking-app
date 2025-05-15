// Ensure user is logged in
function ensureAuth(req, res, next) {
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
    ensureGuest
  };