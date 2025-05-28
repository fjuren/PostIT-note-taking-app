const userService = require('../service/user.service');
const constants = require('../utils/constants.json');

const renderUserAccountPage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user;
    const userWithProfile = await userService.renderUserAccountPage(userId);

    // handle flash message for popup messages
    const flash = req.session.flash;
    delete req.session.flash;
    await req.session.save();

    res.render('user/account', {
      user, // needed for the header; TODO consider changing
      userWithProfile,
      constants,
      flash,
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

    // create a flahs message for popup messages & handling some UI changes (ie. user themes)
    req.session.flash = {
      message: 'Preferences updated successfully!',
      preferencesUpdated: true,
    };
    await req.session.save();

    res.redirect('/user/account');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// /user/account/delete
// delete user account and all associated data
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id
    console.log(userId)
    await userService.deleteUser (userId)

    // flash for user deleted toast message
    req.session.flash = {
      message: 'Account deleted successfully'
    };
    await req.session.save()

    // logs user out and destroys the session session (recall: methods from passport)
    // req.logout(() => {
      // req.session.destroy(() => {
        res.redirect('/');
      // });
    // });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  renderUserAccountPage,
  updateUserPreferences,
  deleteUser
};
