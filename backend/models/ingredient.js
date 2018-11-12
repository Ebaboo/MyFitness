const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  name: {type: String, require: true},
  calories: {type: String, require: true},
})

module.exports = mongoose.model('Ingredient', ingredientSchema)
