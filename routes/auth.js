import express from 'express';
import userController from '../controllers/auth';

const router = express.Router();

// router.route('/logout').post(userController.logout);
router.route('/login').post(userController.login);
router.route('/me').get(userController.me);

export default router;
