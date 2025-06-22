const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const dashboardController = require('../controller/dashboard.controller');

// proceed to dashboard if authed
router.get('/', dashboardController.getDashboard);

module.exports = router;
