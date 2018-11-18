const express = require('express');
const MealUpdated = require('../models/meal-updated');
const router = express.Router();

var moment = require('moment');

router.get('/api/meals', (req, res, next) => {
  const gt = req.query.gt;
  const lt = req.query.lt;
  MealUpdated.find({
    date: {
      $gte: moment(gt, 'DD-MM-YYYY')
        .add(2, 'hours')
        .utc()
        .startOf('day')
        .toISOString(),
      $lt: moment(lt, 'DD-MM-YYYY')
        .add(2, 'hours')
        .utc()
        .endOf('day')
        .toISOString()
    }
  })
    .populate('mealParts.ingredient')
    .then(meals => {
      const updatedIdInMeals = meals.map(meal => {
        return {
          id: meal._id,
          mealType: meal.mealType,
          mealParts: meal.mealParts,
          date: meal.date
        };
      });
      res.status(201).json({
        meals: updatedIdInMeals
      });
    });
});

router.post('/api/meals', (req, res, next) => {
  let meal = {
    mealParts: [{ ingredient: req.body.ingredientId, grams: req.body.amount }],
    mealType: req.body.mealType,
    date: moment()
      .add(2, 'hours')
      .utc()
      .toISOString()
  };
  meal = new MealUpdated(meal);
  meal.save().then(createdIngredient => {
    console.log(createdIngredient);
    res.status(201).json({
      message: 'Ingredient added',
      ingredient: createdIngredient._id
    });
  });
});

module.exports = router;
