const authService = require('../service/auth.service');

// auth with google
const authWithOauthProvider = async (req, res, next) => {
  const middleware = authService.authWithOauthProvider('google', {
    scope: ['profile', 'email'],
  });
  return middleware(req, res, next);
};

// // Google auth callback
const oauthProviderCallback = async (req, res, next) => {
  const middleware = authService.oauthProviderCallback('google', {
    failureRedirect: '/',
    successRedirect: '/dashboard',
  });
  return middleware(req, res, next);
};

// Logout user
const oauthProviderLogout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

// demo account
const demoAccount = async (req, res, next) => {
  const user = await authService.demoAccount();
  req.login(user, (err) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  }); 
}

module.exports = {
  authWithOauthProvider,
  oauthProviderCallback,
  oauthProviderLogout,
  demoAccount
};
