const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override');
const { ensureAuth, ensureGuest } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// enables .env vars
dotenv.config();

// config for passport setup
require('./config/passport');

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
  res.render('login', {
    user: undefined,
    flash: req.session.flash || {}, // enables flash capability if needed in the future
  });
});

// proceed to dashboard if authed
app.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard', {
    user: req.user,
    flash: req.session.flash || {}, // enables flash capability if needed in the future
  });
});

app.use((req, res) => {
  res.status(404).render('error', {
    message: '404 - Page Not Found',
    errors: [{ message: "Sorry, the page you're looking for does not exist" }],
  });
});

// middleware for better api error handling
app.use(errorHandler);

module.exports = app;
