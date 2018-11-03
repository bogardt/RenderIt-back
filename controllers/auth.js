import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users';
import logger from '../modules/winston';
import config from '../config.dev';

const jwtStrategry = require('../modules/passport');

const controller = {};

passport.use(jwtStrategry);

/**
 * Route('/api/users/login')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    bcrypt.compare(req.body.password, user.password, (err, success) => {
      if (err) {
        return res.status(200).send({ message: 'Internal error server', errInfo: err });
      }
      if (success === true) {
        const token = jwt.sign({ email: user.email }, config.secretJWT);
        return res.status(200).send({ bearer: token });
      }
      return res.status(404).send({ message: 'Wrong username or wrong password' });
    });
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send({ message: `Error in register user- ${err}` });
  }
};

/**
 * Route('/api/users/me')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.me = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      return res.status(200).send({
        username: user.username,
        email: user.email,
        id: user.id,
        role: user.role
      });
    })(req, res);
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send(err);
  }
};

export default controller;
