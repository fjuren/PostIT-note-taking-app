const userService = require('../service/user.service');
const constants = require('../utils/constants.json');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const renderUserAccountPage = async (req, res, next) => {
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
    next(err);
  }
};

const renderOffboardPage = async (req, res, next) => {
  try {
    res.render('user/offboard');
  } catch (err) {
    console.error(err);
    console.error('Error rendering offboard page:', err);
    next(err);
  }
};

const updateUserPreferences = async (req, res, next) => {
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
    next(err);
  }
};

// /user/account
// delete user account and all associated data
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await userService.deleteUser(userId);

    // logs user out and destroys the session session (recall: methods from passport)
    req.session.destroy(() => {
      res.redirect('/user/offboard');
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// /user/account/export
// gets a data export of authorized user data
const exportUserData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const formatType = req.body.format;
    console.log('formatType', formatType);
    // get add related user data as exported file
    const userDataExport = await userService.exportUserData(userId);

    if (formatType === 'json') {
      // package export data as json
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="user-data.json"'
      );
      res.setHeader('Content-Type', 'application/json');
      res.send(userDataExport);
    } else if (formatType === 'csv') {
      // package export data as CSV
      const parser = new Parser();
      const csv = parser.parse(userDataExport);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="user-data.csv"'
      );
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    } else if (formatType === 'pdf') {
      // package export data as pdf
      const doc = new PDFDocument();
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="user-data.pdf"'
      );
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
      doc.text(JSON.stringify(userDataExport, null, 2));
      doc.end();
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  renderUserAccountPage,
  updateUserPreferences,
  deleteUser,
  exportUserData,
  renderOffboardPage,
};
