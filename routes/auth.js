const express = require('express');
const passport = require('passport');
const router = express.Router();

// auth with google
router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google auth callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout user
router.get('/auth/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;