const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');

module.exports = function (passport) {

  /**
   * Passport strategies initialization
   * JsonWebToken here
   */

  passport.use(new JwtStrategy({
    /**
     * Options of the stategy
     */
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("Bearer"),
    secretOrKey: "SecretJwtKey"
    /*issuer = 'accounts.examplesoft.com';
    audience = 'yoursite.net';*/
  },
    function (jwtPayload, cb) {
      User.findOne({ 'username': jwtPayload.username })
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          console.log(err);
          return cb(err);
        });
    }
  ));

  /**
   * Produces a JWT for the user and login
   */
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, username, password, done) {
      User.findOne({ username: username })
        .then(user => {
          if (!user){
            return done(false, null, 'Wrong username or wrong password');
          }
          bcrypt.compare(password, user.password, function(err, success)  {
            if (err) {
              console.log(err);
            }
            if (success == true) {
              return done(null, user, 'success');
            }
            else {
              return done(null, false, { message: 'Wrong username or wrong password' });
            }
          });
        }).catch(err => {
          if (err) {
            return done(false, null, 'Error occured');
          }
        });
    }));
}
