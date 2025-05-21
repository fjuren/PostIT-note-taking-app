const mongoose = require('mongoose');

// meant to store 'non-private'user data only
const UserProfileSchema = new mongoose.Schema({
  displayName: { type: String },
  avatar: { type: String },
  preferences: {
    fontSize: { type: Number, default: 16 },
    fontColor: { type: String, default: '#000000' },
    fontFamily: { type: String, default: 'Arial' },
    noteBackground: { type: String, default: '#ffffff' },
    theme: { type: String, default: 'light' },
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' },
  },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
