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
  .post(userController.addFriend);
router.route('/rooms').get(userController.getRooms);
router.route('/rooms/pattern/:id').get(userController.searchRooms);
router
  .route('/friends/:id')
  .get(userController.getFriendProfile)
  .delete(userController.removeFriend);
router.route('/friends/pattern/:id').get(userController.searchFriends);

export default router;
