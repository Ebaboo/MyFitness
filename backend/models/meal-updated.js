const mongoose = require('mongoose');

const mealUpdatedSchema = mongoose.Schema({
  mealParts: [
    {
      ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', require: true },
      grams: { type: Number }
    }
  ],
  mealType: { type: Number, require: true },
  date: { type: String, require: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
});

module.exports = mongoose.model('MealUpdated', mealUpdatedSchema);
