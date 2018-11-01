import passport from 'passport';
import User from '../models/users';
import logger from '../modules/winston';

const bcrypt = require('bcrypt');

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
    newUser.email = req.body.email;
    newUser.role = req.body.role;
    newUser.rooms = [];
    newUser.friends = [];
    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
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
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const friend = await User.findOne({ email: req.body.email });

      if (!friend) {
        return res.status(404).send({ message: 'Profile not found' });
      }

      if (user.friends.includes(friend.email)) {
        return res.status(409).send({ message: 'Already in friends list' });
      }

      user.friends.push(friend.email);
      await user.save();

      return res.status(201).send({ message: 'friend successfully added' });
    })(req, res);
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
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const friend = await User.findOne({ email: req.body.email });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      const userIndex = user.friends.indexOf(friend.email);
      if (userIndex === -1) {
        return res.status(401).send({ message: 'Unauthorized : user not in friends list' });
      }

      user.friends.splice(userIndex, 1);
      await user.save();

      return res.status(201).send({ message: 'Success' });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/users/friends')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getFriends = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      return res.status(201).send({ message: 'Success', friends: user.friends });
    })(req, res);
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
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const friend = await User.findOne({ email: req.param.id });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      return res.status(201).send({
        message: 'Success',
        name: friend.name,
        email: user.email,
        username: user.username,
        description: user.description
      });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/users/pattern/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.searchUser = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      const users = await User.find({ email: { $regex: req.params.id, $options: 'i' } });
      const tmp = [];
      for (var i = 0; i < users.length; i++) {
        tmp[i] = {
          email: users[i].email,
          friend: user.friends.indexOf(users[i].email) !== -1
        };
      }
      return res.status(200).send({ users: tmp });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

export default controller;
