const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override');
const { ensureAuth, ensureGuest } = require('./middleware/auth');

// enables .env vars
dotenv.config();

// config for passport setup
require('./config/passport');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// create express server
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// // Method override for PUT/DELETE requests from forms
app.use(methodOverride('_method'));

// set up for ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// sets public static folder
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/auth.routes'));
app.use('/notes', require('./routes/notes.routes'));
app.use('/user', require('./routes/user.routes'));

// Proceed to login screen if not already authed
app.get('/', ensureGuest, (req, res) => {
  res.render('login', { user: undefined });
});

// proceed to dashboard if authed
app.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard', { user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
