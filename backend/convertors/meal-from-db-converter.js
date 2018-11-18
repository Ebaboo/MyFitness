const mongoose = require('mongoose');
const Ingredient = require('./../models/ingredient');

class oneDayFromDbConverter {
  constructor(dayMeals) {
    const transformedDayMeals = dayMeals.map(meal => {
      return meal.mealParts.map(mealPart => {
        return Ingredient.findById(mealPart.ingredientId)
      });
    });
    return transformedDayMeals;
  }
}

module.exports = oneDayFromDbConverter;
