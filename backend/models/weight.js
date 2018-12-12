const mongoose = require('mongoose');

const weightSchema = mongoose.Schema({
  weight: {type: Number, require: true},
  date: { type: String, require: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
})

module.exports = mongoose.model('Weight', weightSchema)
