import mongoose from 'mongoose';

const RoomSchema = mongoose.Schema({
  name: {
    type: String,
    require: false
  },
  users: {
    type: Array,
    of: String,
    require: true
  },
  history: {
    type: Array,
    of: String,
    require: false
  }
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;
