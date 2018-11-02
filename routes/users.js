import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/').post(userController.register);
//   .put(userController.update)
//   .get(userController.getUser)
//   .delete(userController.deleteUser);
router.route('/pattern/:id').get(userController.searchUser);
router
  .route('/friends')
  .get(userController.getFriends)
  .post(userController.addFriend)
  .delete(userController.removeFriend);
router.route('/friends/:id').get(userController.getFriendProfile);
router.route('/friends/:id').delete(userController.removeFriend);
router.route('/friends/pattern/:id').get(userController.searchFriends);

export default router;
