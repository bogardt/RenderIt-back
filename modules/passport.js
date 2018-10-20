import mongoose from 'mongoose';
import config from '../config.dev';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = mongoose.model('User');

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretJWT
};

module.exports = new JwtStrategy(options, (jwtPayload, cb) => {
  User.findOne({ username: jwtPayload.username })
    .then(user => {
      return cb(null, user);
    })
    .catch(err => {
      console.log(err);
      return cb(err);
    });
});