const User          = require('../models/user-model');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs'); // !!!
const passport      = require('passport');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
  .populate('hives')
  .exec((err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    console.log(userDocument)
    cb(null, userDocument);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username })
      .populate('hives')
      .exec((err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!foundUser) {
          next(null, false, { message: 'Incorrect username.' });
          return;
        }

        if (!bcrypt.compareSync(password, foundUser.password)) {
          next(null, false, { message: 'Incorrect password.' });
          return;
        }

        next(null, foundUser);
      })
}));


