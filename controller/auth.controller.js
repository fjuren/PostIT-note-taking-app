const authService = require('../service/auth.service')

// auth with google
const authWithOauthProvider = async (req,res, next) => {
    const middleware = authService.authWithOauthProvider('google', { scope: ['profile', 'email'] });
    return middleware(req, res, next);
}

// // Google auth callback
const oauthProviderCallback = async (req, res, next) => {
    const middleware = authService.oauthProviderCallback('google', { failureRedirect: '/', successRedirect: '/dashboard' })
    return middleware(req, res, next)
}

// Logout user
// TODO no service function created since my logout doesn't do anything other than logout. Add a service if planning to add more stuff to logout
const oauthProviderLogout = async (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}

module.exports = {
    authWithOauthProvider,
    oauthProviderCallback,
    oauthProviderLogout
}