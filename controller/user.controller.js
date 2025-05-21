const User = require('../models/User');

const renderUserAccountPage = async (req, res) => {
  const userId = req.user.id;
  const user = req.user;
  // removing unessary fields from the resposne to the browser
  const userProfile = await User.findById(userId)
    .select(['-googleId', '-_id'])
    .populate({ path: 'userProfile', select: '-_id' });
  res.render('user/account', {
    user,
    userProfile,
  });
};

module.exports = {
  renderUserAccountPage,
};
