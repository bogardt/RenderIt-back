import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  message: {
    type: String,
    require: true
  },
  from: {
    type: [],
    require: true
  },
  to: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  id: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
    require: true
  }
});
const Message = mongoose.model('Message', MessageSchema);

export default Message;
