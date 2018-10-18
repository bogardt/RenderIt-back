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
      require: true
    },
    username: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    role: {
      type: String,
      require: true
    }
  },
  { collection: 'User' }
);

const UserModel = mongoose.model('User', UserSchema);

UserSchema.pre('save', next => {
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

export default UserModel;

// module.exports = mongoose.model('User', UserModel);
