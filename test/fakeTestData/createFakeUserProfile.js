const UserProfile = require('../../models/UserProfile');

async function createFakeUserProfile() {
  return await UserProfile.create({
    displayName: 'John Doe',
    preferences: {
      theme: 'dark',
      primaryColor: '#9b5de5',
      fontSize: '1',
      fontFamily: 'system-ui',
      timeZone: 'UTC',
      dateFormat: 'yyyy-MM-dd',
    },
  });
}

module.exports = createFakeUserProfile;
