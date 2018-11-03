import passport from 'passport';
import User from '../models/users';
import Message from '../models/message';
import Room from '../models/room';
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

      const friend = await User.findOne({ id: req.body.id });

      if (!friend) {
        return res.status(404).send({ message: 'Profile not found' });
      }

      if (friend.email === user.email) {
        return res.status(409).send({ message: 'You can not add yourself as a friend' });
      }

      const result = user.friends.find(element => element.id === friend.id);
      if (result) return res.status(409).send({ message: 'Already in friends list' });

      user.friends.push(friend);
      await user.save();

      return res.status(201).send({ message: 'friend successfully added' });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/users/friends/:id')
 * DELETE
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

      const friend = await User.findOne({ id: req.params.id });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      const userIndex = user.friends.findIndex(element => element.id === friend.id);
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

      const friend = await User.findOne({ id: req.params.id });
      if (!friend) {
        return res.status(409).send({ message: 'User does not exist' });
      }

      return res.status(200).send({
        message: 'Success',
        id: friend.id,
        name: friend.name,
        email: friend.email,
        username: friend.username,
        description: friend.description
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
      for (let i = 0; i < users.length; i += 1) {
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

/**
 * Route('/api/users/friends/pattern/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.searchFriends = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      const regex = new RegExp(`^${req.params.id}`, 'i');
      const friends = [];
      for (let i = 0; i < user.friends.length; i++) {
        if (user.friends[i].match(regex)) {
          friends.push(user.friends[i]);
        }
      }
      return res.status(200).send({ friends });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/users/rooms')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getRooms = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      return res.status(201).send({ message: 'Success', rooms: user.rooms });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

export default controller;
