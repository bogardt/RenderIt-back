import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/').post(userController.register);
//   .put(userController.update)
//   .get(userController.getUser)
//   .delete(userController.deleteUser);
router.route('/friends')
    .post(userController.addFriend)
    .put(userController.removeFriend);
router.route('/friends/:id')
    .get(userController.getFriendProfile);


export default router;
