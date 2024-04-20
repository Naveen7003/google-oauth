var express = require('express');
var router = express.Router();
const userModel = require('./users')
const passport = require('passport');
const GoogleStrategy=require('passport-google-oidc');
require('dotenv').config();
// google statefy code 
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile', 'email' ]
},async function verify(issuer, profile, cb) {
  let user = await userModel.findOne({ name:profile.displayName})
  if(!user){
    user = await userModel.create({
      name:profile.displayName,
      email: profile.emails[0].value
    })
  }
  return cb(null,user);
}));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs');
});

router.get('/profile', function(req, res, next) {
  res.render('profile.ejs');
});

router.get('/login/federated/google', passport.authenticate('google'));


router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

module.exports = router;
