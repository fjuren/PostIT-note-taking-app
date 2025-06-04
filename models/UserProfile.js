const mongoose = require('mongoose');

// meant to store 'non-private'user data only
const UserProfileSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    maxLength: [100, 'Display name cannot exceed 100 characters.'],
  },
  // avatar: { type: String },
  preferences: {
    theme: {
      type: String,
      default: 'light',
      enum: {
        values: ['light', 'dark'],
        message: 'Theme can only be light or dark',
      },
    },
    primaryColor: { type: String, default: '#9b5de5' },
    fontSize: {
      type: String,
      default: '1',
      enum: {
        values: ['0.75', '0.875', '1', '1.125', '1.25'],
        message:
          'Incorrect font size. Please choose from the available options.',
      },
    }, // 1rem; setting as string rather than number since it causes a bootstrap bug on pre-selecting dropdown options (eg. on the account page)
    fontFamily: {
      type: String,
      default: 'system-ui',
      enum: {
        values: [
          'system-ui',
          "'Inter', sans-serif",
          "'Roboto', sans-serif",
          "'Helvetica Neue', sans-serif",
          "'Segoe UI', sans-serif",
          "'Georgia', serif",
          "'Arial', sans-serif",
          "'Times New Roman', serif",
        ],
        message: 'Incorrect font. Please choose from the available options.',
      },
    }, // to match OS defaults
    timeZone: {
      type: String,
      default: 'UTC',
      enum: {
        values: [
          'UTC',
          'America/New_York',
          'America/Chicago',
          'America/Denver',
          'America/Los_Angeles',
          'Europe/London',
          'Europe/Paris',
          'Europe/Berlin',
          'Asia/Tokyo',
          'Asia/Shanghai',
          'Asia/Kolkata',
          'Australia/Sydney',
          'America/Sao_Paulo',
          'Africa/Johannesburg',
          'Pacific/Auckland',
        ],
        message:
          'Incorrect time zone. Please choose from the available options.',
      },
    },
    dateFormat: {
      type: String,
      default: 'yyyy-MM-dd',
      enum: {
        values: [
          'MM/dd/yyyy',
          'dd/MM/yyyy',
          'yyyy-MM-dd',
          'LLLL d, yyyy',
          'd LLL yyyy',
          'd LLLL yyyy',
        ],
        message: 'Incorrect format. Please choose from the available options.',
      },
    },
  },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
