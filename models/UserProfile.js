const mongoose = require('mongoose');

// meant to store 'non-private'user data only
const UserProfileSchema = new mongoose.Schema({
  displayName: { type: String },
  // avatar: { type: String },
  preferences: {
    // fontSize: { type: Number, default: 16 },
    theme: { type: String, default: 'light' },
    primaryColor: { type: String, default: '#9b5de5' },
    fontFamily: { type: String, default: 'Arial' },
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' },
  },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
