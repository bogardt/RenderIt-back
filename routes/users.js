import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/').post(userController.register);
//   .put(userController.update)
//   .get(userController.getUser)
//   .delete(userController.deleteUser);

router.route('/login').post(userController.login);
// router.route('/logout').post(userController.logout);
router.route('/me').get(userController.me);

export default router;
