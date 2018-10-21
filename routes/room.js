import express from 'express';
import roomController from '../controllers/room';

const router = express.Router();

router.route('/')
    .post(roomController.createRoom);
router.route('/:id')
    .get(roomController.getRoom)
    .delete(roomController.deleteRoom);
router.route('/:id/leave')
    .post(roomController.leaveRoom);
router.route('/:id/join/:userId')
    .post(roomController.joinRoom);

export default router;
