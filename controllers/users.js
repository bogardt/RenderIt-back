import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import logger from '../modules/winston';
import config from '../config.dev';

const controller = {};

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
      return res.status(400).send({ success: false, message: 'User already exists in database' });
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
  passport.authenticate('local-login', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error', errorInfo: err });
    }
    if (!user) {
      return res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }
    const token = jwt.sign({ username: user.username }, config.secretJWT);
    return res.status(200).send({ authToken: token });
  })(req, res);
};

/**
 * Route('/api/users/me')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.me = async (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error', errorInfo: err });
    }
    if (!user) {
      return res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }
    return res.status(200).send({
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username
    });
  })(req, res);
};

export default controller;
