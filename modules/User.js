const mongoose = require('mongoose')
const { Schema } = mongoose;
//User Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  date: {type: Date, default: Date.now}
});
//Converting Into Model
const User = mongoose.model('User',UserSchema);
module.exports = User;