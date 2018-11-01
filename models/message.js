import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  message: {
    type: String,
    require: true
  },
  from: {
    type: String,
    require: true
  },
  to: {
    type: Array,
    of: String,
    require: true
  }
});

const Message = mongoose.model('Message', MessageSchema);
