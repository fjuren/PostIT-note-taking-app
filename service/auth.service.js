const passport = require('passport');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

// auth with google
const authWithOauthProvider = (oAuthProvider, authenticateOptions) => {
    return passport.authenticate(oAuthProvider, authenticateOptions)
}

// // Google auth callback
const oauthProviderCallback = (oAuthProvider, authenticateOptions) => {
    return passport.authenticate(oAuthProvider, authenticateOptions)
}

// creates demo account (same logic as oAuth passport; no change)
const demoAccount = async () => {
    try {
    let user = await User.findOne({ googleId: 'demo-user-123' });
    
    if (user) {
      // Update last login for existing demo user
      await UserProfile.findOneAndUpdate(
        { _id: user.userProfile },
        {
          $set: {
            lastLogin: new Date(),
          },
        },
        { new: true }
      );
        return user; 
    } else {
      // Create demo user for first time
      const userProfile = await UserProfile.create({
        displayName: 'Demo User',
      });

      user = await User.create({
        googleId: 'demo-user-123',
        name: {
          firstName: 'Demo',
          lastName: 'User',
        },
        email: 'demo@yourapp.com',
        image: 'https://robohash.org/demo-user?size=150x150',
        userProfile: userProfile._id,
      });
      return user
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
    authWithOauthProvider,
    oauthProviderCallback,
    demoAccount
}