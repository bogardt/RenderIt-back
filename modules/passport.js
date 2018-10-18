import bcrypt from 'bcrypt';
import config from '../config.dev';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/users.js');

/**
 * Options of the stategy
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
