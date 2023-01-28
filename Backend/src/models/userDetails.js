const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  email: String,
  username: String,
  name:String,
  userId: String,
  photo:String
  

});

var userdata = mongoose.model('userdata', UserSchema);
module.exports = userdata;