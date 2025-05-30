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

// /user/account
// delete user account and all associated data
router.delete('/account', ensureAuth, userController.deleteUser);

// /user/account/export
// requests a data export of authorized user data
router.post('/account/export', ensureAuth, userController.exportUserData);

module.exports = router;
