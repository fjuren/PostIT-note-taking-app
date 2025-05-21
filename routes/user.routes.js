const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const userController = require('../controller/user.controller');

// /user/account
// renders the user's account page
router.get('/account', ensureAuth, userController.renderUserAccountPage);

module.exports = router;
