import bcrypt from 'bcrypt';
import config from '../config.dev';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/users.js');

/**
 * Passport strategies initialization
 * JsonWebToken here
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
      secretOrKey: config.secretJWT
      /*
       * issuer = 'accounts.examplesoft.com';
       * audience = 'yoursite.net';
       */
    },
    (jwtPayload, cb) => {
      User.findOne({ username: jwtPayload.username })
        .then(user => cb(null, user))
        .catch(err => {
          console.log(err);
          return cb(err);
        });
    }
  )
);

/**
 * Produces a JWT for the user and login
 */
passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ username: username })
        .then(user => {
          if (!user) {
            return done(false, null, 'Wrong username or wrong password');
          }
          bcrypt.hash(password, user.password, (err, success) => {
            if (err) {
              console.log(err);
            }
            if (success === true) {
              return done(null, user, 'success');
            }
            return done(null, false, { message: 'Wrong username or wrong password' });
          });
        })
        .catch(err => {
          if (err) {
            return done(false, null, 'Error occured');
          }
        });
    }
  )
);
