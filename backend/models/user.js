const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  nickname: {type: String, required: true},
  startWeight: {type: Number, required: true},
  gender: {type: String, required: true},
  goalWeight: {type: String, required: true}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
