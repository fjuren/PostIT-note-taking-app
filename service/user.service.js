const User = require('../models/User');
const miscHelpers = require('../utils/misc')

const renderUserAccountPage = async (userId) => {
  // removing unessary fields from the resposne to the browser
  const originalUserWithProfile = await User.findById(userId)
    .select(['-googleId', '-_id'])
    .populate({ path: 'userProfile', select: '-_id' }).lean()

  // apply formatting to date based on user preference
  const userWithProfile = { ...originalUserWithProfile, createdAt: miscHelpers.formatDateWithPreferences(originalUserWithProfile.userProfile, originalUserWithProfile.createdAt) }
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
  if (!user || !user.userProfile) {
    throw new Error('User or UserProfile not found');
  }

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

module.exports = {
  renderUserAccountPage,
  updateUserPreferences,
};
