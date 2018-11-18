const mongoose = require('mongoose');

const mealUpdatedSchema = mongoose.Schema({
  mealParts: [
    {
      ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', require: true },
      grams: { type: Number }
    }
  ],
  mealType: { type: Number },
  date: String
});

module.exports = mongoose.model('MealUpdated', mealUpdatedSchema);
