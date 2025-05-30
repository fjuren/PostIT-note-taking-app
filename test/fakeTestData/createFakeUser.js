const mongoose = require('mongoose');
const User = require('../../models/User');
const createFakeUserProfile = require('./createFakeUserProfile');

async function createFakeUser() {
  const userProfile = await createFakeUserProfile();
  const manualUserID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'); // FYI ID matches fake user created in /middleware/auth file

  const user = new User({
    _id: manualUserID,
    googleId: '198374019832471098234712394',
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    email: 'john@example.com',
    image: 'https://example.com/pictureofjohn.jpg',
    userProfile: userProfile._id,
  });

  return await user.save();
}
module.exports = createFakeUser;
