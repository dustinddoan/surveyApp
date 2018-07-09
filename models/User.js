const mongoose = require('mongoose');
// const Schema = mongoose.Schema
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  photoUrl: String,
  credits: {type: Number, default: 0}
})
// table users, use schema userSchema 
module.exports = mongoose.model('users', userSchema);

