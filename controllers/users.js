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
 * Route('/api/users')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.register = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send({ message: 'User already exists' });
    }
    const newUser = new User();
    newUser.username = req.body.username;
    newUser.name = req.body.name;
    newUser.password = req.body.password;
    newUser.email = req.body.email;
    newUser.role = req.body.role;
    await newUser.save();
    return res.status(201).send({ message: 'User successfully created' });
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send({ message: `Error in register user- ${err}` });
  }
};

/**
 * Route('/api/users/login')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    bcrypt.compare(req.body.password, user.password, (err, success) => {
      if (err) {
        return res.status(200).send({ message: 'Internal error server', errInfo: err });
      }
      if (success === true) {
        const token = jwt.sign({ username: user.username }, config.secretJWT);
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
        role: user.role
      });
    })(req, res);
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send(err);
  }
};

export default controller;
