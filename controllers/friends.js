import passport from 'passport';
import User from '../models/users';
import logger from '../modules/winston';

const jwtStrategry = require('../modules/passport');

const controller = {};

passport.use(jwtStrategry);

/**
 * Route('/api/friends')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.addFriend = async (req, res) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const friend = await User.findOne({ email: req.body.user.email });
            if (!friend) { return res.status(409).send({ message: 'User does not exist' }); }

            user.friends.push(friend.email);
            await user.save();

            return res.status(201).send({ message: 'friend successfully added' });
        });
      } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
      }
};

/**
 * Route('/api/friends')
 * PUT
 * @param {*} req
 * @param {*} res
 */
controller.removeFriend = async (req, res) => { 
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const friend = await User.findOne({ email: req.body.user.email });
            if (!friend) { return res.status(409).send({ message: 'User does not exist' }); }

            if ((userIndex = user.friends.indexOf(friend.email)) == -1) { return res.status(401).send({ message: 'Unauthorized : user not in friends list' }); }

            user.friends.splice(userIndex, 1);
            await user.save();

            return res.status(201).send({ message: 'Success' });
        });
      } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
      }
};

/**
 * Route('/api/friends/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getFriendProfile = async (req, res) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) { return res.status(500).send(err); }
            if (!user) { return res.status(401).send({ message: 'Unauthorized' }); }

            const friend = await User.findOne({ email: req.body.user.email });
            if (!friend) { return res.status(409).send({ message: 'User does not exist' }); }

            return res.status(201).send([ message => 'Success', name => friend.name, email => user.email, username => user.username,
                                         description => user.description]);
        });
      } catch (err) {
        logger.error(`Error- ${err}`);
        return res.status(500).send({ message: `Error- ${err}` });
      }
};

export default controller;
