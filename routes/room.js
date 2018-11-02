import express from 'express';
import roomController from '../controllers/room';

const router = express.Router();

router.route('/').post(roomController.createRoom);
router
  .route('/:id')
  .get(roomController.getRoom)
  .delete(roomController.deleteRoom);
router.route('/:id/leave').put(roomController.leaveRoom);
router.route('/:id/join/').put(roomController.joinRoom);

export default router;
