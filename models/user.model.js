const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var UserModel = new Schema({
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
});

UserModel.pre('save', function (next) {
  var user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return;
    bcrypt.hash(user.password, salt, function (err, hash) {
      console.log(hash);
      if (err) return;
      user.password = hash;
      next();
    });
  });
});

/*UserModel.pre("update", function (next) {
  var user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return;
    bcrypt.hash(user.password, salt, function (err, hash) {

      if (err) return;
      user.password = hash;
      next();
    });
  });
});*/

const User = module.exports = mongoose.model("User", UserModel);
