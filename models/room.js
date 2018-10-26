const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var RoomModel = new Schema({
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

const Room = module.exports = mongoose.model("Room", RoomModel);