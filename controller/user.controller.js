const userService = require('../service/user.service');
const constants = require('../utils/constants.json');

const renderUserAccountPage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    const userWithProfile = await userService.renderUserAccountPage(userId);
    res.render('user/account', {
      user, // needed for the header; TODO consider changing
      userWithProfile,
      constants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      displayName,
      theme,
      primaryColor,
      fontSize,
      fontFamily,
      timeZone,
      dateFormat,
    } = req.body;
    console.log(
      displayName,
      theme,
      primaryColor,
      fontSize,
      fontFamily,
      timeZone,
      dateFormat
    );
    await userService.updateUserPreferences(
      userId,
      displayName,
      theme,
      primaryColor,
      fontSize,
      fontFamily,
      timeZone,
      dateFormat
    );

    res.redirect('/user/account');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  renderUserAccountPage,
  updateUserPreferences,
};
