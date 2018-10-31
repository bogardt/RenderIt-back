import mongoose from 'mongoose';

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
      require: true
    },
    password: {
      type: String,
      require: true
    },
    rooms: {
      type: Array,
      of: String,
      require: false
    },
    friends: {
      type: Array,
      of: String,
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

exports.test = async function test(email, callback) {
  await User.findOne({email: email.email}, function(err, userObj) {
      if(err) {
          return callback(err, null);
      } else if (userObj) {
          return callback(null, userObj);
      } else {
          return callback(null, null);
      }
  });
}

export default UserModel;
