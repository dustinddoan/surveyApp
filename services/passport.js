const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const keys = require('../config/keys')


// require('../models/User')
// no need above code since we loadmodel User first 
// in index.js file

const User = mongoose.model('users')

// determines, which data of the user object should 
// be stored in the session.The result of the serializeUser 
// method is attached to the session as req.session.passport.user = {}.
// req.session.passport.user = {id:'xyz'}
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
})


passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, (accessToken, refreshToken, profile, done) => {
    // console.log('token: ', accessToken)
    // console.log('refresh token: ', refreshToken)
    // console.log('profile: ', profile)

    User.findOne({googleId: profile.id})
      .then(existingUser => {
        if (existingUser) {
          console.log('user already exist')
          // we already have a record with given profile.id
          done(null, existingUser)
        } else {
          // create new User
          new User({googleId: profile.id})
            .save()
            .then(user => done(null, user))
        }
      })
  })
)