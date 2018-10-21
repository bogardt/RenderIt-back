const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var MessageModel = new Schema({
  message: {
    type: String,
    require: true
  },
  from: {
      type: string,
      require: true
  },
  to: {
      type: Array,
      of: string,
      require: true
  }
});

const Message = module.exports = mongoose.model("Message", MessageModel);
