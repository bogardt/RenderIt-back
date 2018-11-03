import mongoose from 'mongoose';

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    require: false
  },
  users: {
    type: Array,
    require: true
  },
  history: {
    type: [],
    require: false
  },
  id: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
    require: true
  }
});
const Room = mongoose.model('Room', RoomSchema);

export default Room;
