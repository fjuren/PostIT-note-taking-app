const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { ensureAuth } = require('../middleware/auth');

// auth with google
router.get('/auth/google', authController.authWithOauthProvider);

// Google auth callback
router.get('/auth/google/callback', authController.oauthProviderCallback);

// Logout user
router.get('/auth/logout', ensureAuth, authController.oauthProviderLogout);

module.exports = router;
