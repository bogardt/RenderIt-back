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
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            newRoom = new Room();
            newRoom.name = req.body.name;
            newRoom.users.push(user.email);
            newRoom.save();

            user.rooms.push(newRoom.name);
            user.save();

            return res.status(201).send({ message: 'Room successfully created' });
        });
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
controller.deleteRoom = async (req, res, id) => {

};

/**
 * Route('/api/room/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getRoom = async (req, res, id) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const room = Room.findOne({ name: id });
            if (!room) { return res.status(409).send({ message: 'Room does not exist' }); }

            if ((roomIndex = room.users.indexOf(user.email)) == -1) { return res.status(401).send({ message: 'Unauthorized : user not in room' }); }
            if ((userIndex = user.rooms.indexOf(room.name)) == -1) { return res.status(401).send({ message: 'Unauthorized : user not in room' }); }

            return res.status(201).send([ message => 'Success', name => room.name, history => room.history, users => room.users ]);
        });
    } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
    }
};

/**
 * Route('/api/room/:id/leave')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.leaveRoom = async (req, res, id) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const room = Room.findOne({ name: id });
            if (!room) { return res.status(409).send({ message: 'Room does not exist' }); }

            if ((roomIndex = room.users.indexOf(user.email)) == -1) { return res.status(401).send({ message: 'Unauthorized : user not in room' }); }
            if ((userIndex = user.rooms.indexOf(room.name)) == -1) { return res.status(401).send({ message: 'Unauthorized : user not in room' }); }

            room.users.splice(roomIndex, 1);
            room.save();

            user.rooms.splice(userIndex, 1);
            user.save();

            return res.status(201).send({ message: 'Success' });
        });
    } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
    }
};

/**
 * Route('/api/room/:id/join/:userId')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.joinRoom = async (req, res, id, userId) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const room = Room.findOne({ name: id });
            const newUser = User.findOne({email: userId});
            if (!newUser) { return res.status(409).send({ message: 'User does not exist' }); }
            if (!room) { return res.status(409).send({ message: 'Room does not exist' }); }

            room.users.push(newUser.email);
            room.save();

            newUser.rooms.push(room.name);
            newUser.save();

            return res.status(201).send({ message: 'User successfully added' });
        });

    } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
    }
};

export default controller;
