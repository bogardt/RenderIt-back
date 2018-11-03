import passport from 'passport';
import logger from '../modules/winston';
import Room from '../models/room';
import User from '../models/users';

const jwtStrategry = require('../modules/passport');

const controller = {};

passport.use(jwtStrategry);

/**
 * Route('/api/room')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.createRoom = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const newRoom = new Room();
      newRoom.name = req.body.name;
      newRoom.users.push(user.id);
      newRoom.history = [];
      await newRoom.save();

      user.rooms.push(newRoom);
      await user.save();

      return res.status(201).send({ message: 'Room successfully created', room: newRoom });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/room/:id')
 * DELETE
 * @param {*} req
 * @param {*} res
 */
controller.deleteRoom = async (req, res) => {
  try {
    return res.status(404).send({ message: 'Not found' });
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/room/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getRoom = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const room = await Room.findOne({ id: req.params.id });
      if (!room) {
        return res.status(409).send({ message: 'Room does not exist' });
      }

      const roomIndex = room.users.indexOf(user.id);
      const userIndex = user.rooms.findIndex(element => element.id === room.id);
      if (roomIndex === -1) {
        return res.status(200).send({
          message: 'Not in room',
          name: room.name,
          id: room.id,
          history: [],
          users: room.users
        });
      }

      if (!userIndex) {
        return res.status(200).send({
          message: 'Not in room',
          name: room.name,
          id: room.id,
          history: [],
          users: room.users
        });
      }

      return res.status(200).send({
        message: 'Success',
        name: room.name,
        id: room.id,
        history: room.history,
        users: room.users
      });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/room/:id/leave')
 * PUT
 * @param {*} req
 * @param {*} res
 */
controller.leaveRoom = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const room = await Room.findOne({ id: req.params.id });
      if (!room) {
        return res.status(409).send({ message: 'Room does not exist' });
      }

      const roomIndex = room.users.indexOf(user.id);
      const userIndex = user.rooms.findIndex(element => element.id === room.id);
      if (roomIndex === -1) {
        return res.status(401).send({ message: 'Unauthorized : user not in room' });
      }
      if (!userIndex) {
        return res.status(401).send({ message: 'Unauthorized : user not in room' });
      }

      room.users.splice(roomIndex, 1);
      await room.save();

      user.rooms.splice(userIndex, 1);
      await user.save();

      return res.status(201).send({ message: 'Success' });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

/**
 * Route('/api/room/:id/join/')
 * PUT
 * @param {*} req
 * @param {*} res
 */
controller.joinRoom = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const room = await Room.findOne({ id: req.params.id });
      const newUser = await User.findOne({ email: user.email });
      if (!newUser) {
        return res.status(409).send({ message: 'User does not exist' });
      }
      if (!room) {
        return res.status(409).send({ message: 'Room does not exist' });
      }

      const roomIndex = room.users.indexOf(user.id);
      if (roomIndex !== -1) {
        return res.status(409).send({ message: 'User already registered in room' });
      }

      room.users.push(newUser.id);
      await room.save();

      newUser.rooms.push(room);
      await newUser.save();

      return res.status(201).send({ message: 'User successfully added to room' });
    })(req, res);
  } catch (err) {
    logger.error(`Error- ${err}`);
    return res.status(500).send({ message: `Error- ${err}` });
  }
};

export default controller;
