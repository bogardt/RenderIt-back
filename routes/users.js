import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/').post(userController.register);
//   .put(userController.update)
//   .get(userController.getUser)
//   .delete(userController.deleteUser);

export default router;
