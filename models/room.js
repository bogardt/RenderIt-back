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
    type: Array,
    require: false
  }
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;
