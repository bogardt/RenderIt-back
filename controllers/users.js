import passport from 'passport';
import User from '../models/users';
import logger from '../modules/winston';

const jwtStrategry = require('../modules/passport');

const controller = {};

passport.use(jwtStrategry);

/**
 * Route('/api/users/register')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.register = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(409).send({ message: 'User already exists' });
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

export default controller;
