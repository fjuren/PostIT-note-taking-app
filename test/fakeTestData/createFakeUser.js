const User = require('../../models/User');
const createFakeUserProfile = require('./createFakeUserProfile');

async function createFakeUser() {
  const userProfile = await createFakeUserProfile();
  return await User.create({
    googleId: '198374019832471098234712394',
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    email: 'john@example.com',
    image: 'https://example.com/pictureofjohn.jpg',
    userProfile: userProfile._id,
  });
}

module.exports = createFakeUser;
