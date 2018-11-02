import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    socket: {
      type: String,
      require: false
    },
    name: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    username: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    rooms: {
      type: Array,
      require: false
    },
    friends: {
      type: Array,
      require: false
    },
    description: {
      type: String,
      require: false
    },
    role: {
      type: String,
      require: true,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'User' }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
