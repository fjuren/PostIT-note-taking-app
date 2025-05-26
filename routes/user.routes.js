const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const userController = require('../controller/user.controller');

// /user/account
// renders the user's account page
router.get('/account', ensureAuth, userController.renderUserAccountPage);

// /user/account/preferences
// submit a put request for updating user preferences
router.put(
  '/account/preferences',
  ensureAuth,
  userController.updateUserPreferences
);

// /user/account/delete
// delete user account
router.delete('')

module.exports = router;
