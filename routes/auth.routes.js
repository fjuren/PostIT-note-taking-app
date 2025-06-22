const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { ensureAuth } = require('../middleware/auth');

// auth with google
router.get('/google', authController.authWithOauthProvider);

// Google auth callback
router.get('/google/callback', authController.oauthProviderCallback);

// Logout user
router.get('/logout', ensureAuth, authController.oauthProviderLogout);

// Demo account
router.post('/demo', authController.demoAccount);

module.exports = router;
