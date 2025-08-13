const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

const handleGoogleLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    // Checking if user already exists. If yes, update fields to most recent from provider
    if (user) {
      user = await User.findOneAndUpdate(
        { googleId: profile.id },
        {
          $set: {
            name: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName || '',
            },
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          },
        },
        { new: true }
      );

      await UserProfile.findOneAndUpdate(
        { _id: user.userProfile },
        {
          $set: {
            displayName: profile.displayName || profile.name.givenName,
            lastLogin: new Date(),
          },
        },
        { new: true }
      );
      done(null, user);
    } else {
      const userProfile = await UserProfile.create({
        displayName: profile.displayName || profile.name.givenName,
      });
      // Create new user with linked userProfile
      user = await User.create({
        googleId: profile.id,
        name: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName || '',
        },
        email: profile.emails[0].value,
        image: profile.photos[0].value,
        userProfile: userProfile._id,
      });
      done(null, user);
    }
  } catch (err) {
    console.error(err);
    done(err, null);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    handleGoogleLogin
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('userProfile');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = handleGoogleLogin;
