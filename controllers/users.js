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
    const user = await User.findOne({ email: req.body.email });
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

/**
 * Route('/api/users/friends')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.addFriend = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const friend = User.findOne({ email: req.body.user.email });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      user.friends.push(friend.email);
      user.save();

      return res.status(201).send({ message: 'friend successfully added' });
    });
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/users/friends')
 * PUT
 * @param {*} req
 * @param {*} res
 */
controller.removeFriend = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const friend = User.findOne({ email: req.body.user.email });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      const userIndex = user.friends.indexOf(friend.email);
      if (userIndex === -1) {
        return res.status(401).send({ message: 'Unauthorized : user not in friends list' });
      }

      user.friends.splice(userIndex, 1);
      user.save();

      return res.status(201).send({ message: 'Success' });
    });
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/users/friends/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getFriendProfile = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const friend = User.findOne({ email: req.body.user.email });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      return res
        .status(201)
        .send([
          message => 'Success',
          name => friend.name,
          email => user.email,
          username => user.username,
          description => user.description]);
    });
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

export default controller;
