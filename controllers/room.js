import passport from 'passport';
import User from '../models/users';
import logger from '../modules/winston';

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

};

/**
 * Route('/api/room/:id')
 * DELETE
 * @param {*} req
 * @param {*} res
 */
controller.deleteRoom = async (req, res) => {

};

/**
 * Route('/api/room/:id')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getRoom = async (req, res) => {

};

/**
 * Route('/api/room/:id/leave')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.leaveRoom = async (req, res) => {

};

/**
 * Route('/api/room/:id/join/:userId')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.joinRoom = async (req, res) => {

};

export default controller;
