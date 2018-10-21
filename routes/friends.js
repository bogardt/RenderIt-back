import express from 'express';
import friendsController from '../controllers/friends';

const router = express.Router();

router.route('/')
    .post(friendsController.addFriend)
    .put(friendsController.removeFriend);
router.route('/:id')
    .get(friendsController.getFriendProfile);
export default router;
