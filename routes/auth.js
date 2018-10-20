import express from 'express';
import authController from '../controllers/auth';

const router = express.Router();

// router.route('/logout').post(userController.logout);
router.route('/login').post(authController.login);
router.route('/me').get(authController.me);

export default router;
