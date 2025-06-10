const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Note = require('../models/Note');
const miscHelpers = require('../utils/misc');
const mongoose = require('mongoose');

const renderUserAccountPage = async (userId) => {
  // removing unessary fields from the resposne to the browser
  const originalUserWithProfile = await User.findById(userId)
    .select(['-googleId', '-_id'])
    .populate({ path: 'userProfile', select: '-_id' })
    .lean();

  // apply formatting to date based on user preference
  const userWithProfile = {
    ...originalUserWithProfile,
    createdAt: miscHelpers.formatDateWithPreferences(
      originalUserWithProfile.userProfile,
      originalUserWithProfile.createdAt
    ),
  };
  return userWithProfile;
};

const updateUserPreferences = async (
  userId,
  displayName,
  theme,
  primaryColor,
  fontSize,
  fontFamily,
  timeZone,
  dateFormat
) => {
  const user = await User.findById(userId).populate('userProfile');
  console.log('user :', user)
  if (!user || !user.userProfile) {
    throw new Error('User or UserProfile not found');
  }
  // console.log('userprofile: ', user.userProfile)
  user.userProfile.displayName = displayName;
  user.userProfile.preferences = {
    theme,
    primaryColor,
    fontSize,
    fontFamily,
    timeZone,
    dateFormat,
  };
  await user.userProfile.save();
  return user;
};

// /user/account
// delete user account and all associated data
const deleteUser = async (userId) => {
  const mongooseSession = await mongoose.startSession();
  try {
    // IMPORTANT: withTransaction will rollback any deletions if anything fails within the try block
    await mongooseSession.withTransaction(async () => {
      const user = await User.findById(userId).session(mongooseSession);
      if (!deleteUser) {
        throw new Error('Error deleteing account; User not found');
      }
      // deletes cascading data
      await UserProfile.findByIdAndDelete(user.userProfile).session(
        mongooseSession
      );
      await Note.deleteMany({ user: userId }).session(mongooseSession);
      // delete user if all good
      await User.findByIdAndDelete(userId).session(mongooseSession);
      return;
    });
  } catch (err) {
    console.error('Error deleting user: ', err);
    throw err;
  } finally {
    await mongooseSession.endSession();
  }
};

// /user/account/export
// gets a data export of authorized user data
const exportUserData = async (userId) => {
  const user = await User.findById(userId).populate('userProfile');
  const notes = await Note.find({ user: userId });
  return {
    dataForExport: {
      user,
      notes,
    },
  };
};

module.exports = {
  renderUserAccountPage,
  updateUserPreferences,
  deleteUser,
  exportUserData,
};
