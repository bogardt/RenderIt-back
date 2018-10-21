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
    return(null) ;
};

/**
 * Route('/api/friends')
 * PUT
 * @param {*} req
 * @param {*} res
 */
controller.removeFriend = async (req, res) => { 
    return(null) ;
};

/**
 * Route('/api/friends/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getFriendProfile = async (req, res) => { 
    return(null) ;
};

export default controller;
