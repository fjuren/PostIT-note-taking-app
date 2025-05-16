const passport = require('passport');

// auth with google
const authWithOauthProvider = (oAuthProvider, authenticateOptions) => {
    return passport.authenticate(oAuthProvider, authenticateOptions)
}

// // Google auth callback
const oauthProviderCallback = (oAuthProvider, authenticateOptions) => {
    return passport.authenticate(oAuthProvider, authenticateOptions)
}


module.exports = {
    authWithOauthProvider,
    oauthProviderCallback
}