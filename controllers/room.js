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
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            newRoom = new Room();
            newRoom.name = req.body.name;
            newRoom.users.push(user.email);
            await newRoom.save();

            user.rooms.push(newRoom.name);
            await user.save();

            return res.status(201).send({ message: 'Room successfully created' });
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
controller.deleteRoom = (req, res) => {

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
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const room = await Room.findOne({ name: req.param.id });
            if (!room) { return res.status(409).send({ message: 'Room does not exist' }); }

            const roomIndex = room.users.indexOf(user.email);
            const userIndex = user.rooms.indexOf(room.name);
            if (roomIndex == -1 || userIndex == -1) 
                { return res.status(401).send({ message: 'Unauthorized : user not in room' }); }

            return res.status(201).send([ message => 'Success', name => room.name, history => room.history, users => room.users ]);
        })(req, res);
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
controller.leaveRoom = async (req, res) => {
    try {
        passport.authenticate('jwt', { session: false }, async (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const room = await Room.findOne({ name: req.param.id });
            if (!room) { return res.status(409).send({ message: 'Room does not exist' }); }

            const roomIndex = room.users.indexOf(user.email);
            const userIndex = user.rooms.indexOf(room.name);
            if (roomIndex == -1 || userIndex == -1) 
                { return res.status(401).send({ message: 'Unauthorized : user not in room' }); }

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
 * Route('/api/room/:id/join/:userId')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.joinRoom = async (req, res) => {
    try {
        passport.authenticate('jwt', { session: false }, async (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const room = await Room.findOne({ name: req.param.id });
            const newUser = await User.findOne({email: req.param.userId});
            if (!newUser) { return res.status(409).send({ message: 'User does not exist' }); }
            if (!room) { return res.status(409).send({ message: 'Room does not exist' }); }

            room.users.push(newUser.email);
            await room.save();

            newUser.rooms.push(room.name);
            await newUser.save();

            return res.status(201).send({ message: 'User successfully added' });
        })(req, res);

    } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
    }
};


export default controller;