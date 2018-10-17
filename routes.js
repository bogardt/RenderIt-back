const user = require('./modules/user');
const express = require('express');
const router = express.Router();

/**
 * Authentification routes
 */
router.route('/register').post(user.register);
router.route('/login').post(user.signIn);
router.route('/logout').get(user.logout);
router.route('/me').get(user.me);

module.exports = router;