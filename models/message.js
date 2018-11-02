import mongoose from 'mongoose';
import UserModel from './users';

const MessageSchema = mongoose.Schema({
  message: {
    type: String,
    require: true
  },
  from: {
    type: UserModel,
    require: true
  },
  to: {
    type: String,
    require: true
  }
});

const Message = mongoose.model('Message', MessageSchema);
