import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/').post(userController.register);
//   .put(userController.update)
//   .get(userController.getUser)
//   .delete(userController.deleteUser);
router.route('/pattern/:id').post(userController.searchUser);
router
  .route('/friends')
  .get(userController.getFriends)
  .post(userController.addFriend)
  .put(userController.removeFriend);
router.route('/friend/:id').get(userController.getFriendProfile);
router.route('/rooms').get(userController.getRooms);

export default router;
