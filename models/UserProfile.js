const mongoose = require('mongoose');

// meant to store 'non-private'user data only
const UserProfileSchema = new mongoose.Schema({
  displayName: { type: String },
  // avatar: { type: String },
  preferences: {
    theme: { type: String, default: 'light' },
    primaryColor: { type: String, default: '#9b5de5' },
    fontSize: { type: String, default: '1' }, // 1rem; setting as string rather than number since it causes a bootstrap bug on pre-selecting dropdown options (eg. on the account page)
    fontFamily: { type: String, default: 'system-ui' }, // to match OS defaults
    timeZone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' },
  },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
