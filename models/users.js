import mongoose from 'mongoose';

const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
  {
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
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
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

UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return;
    bcrypt.hash(user.password, salt, (errOnHash, hash) => {
      if (errOnHash) return;
      user.password = hash;
      next();
    });
  });
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
