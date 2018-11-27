const express = require('express');
const MealUpdated = require('../models/meal-updated');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

var moment = require('moment');

router.get('/api/meals', checkAuth, (req, res, next) => {
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
        .toISOString(),
    },
    user: req.userData.userId
  })
    .populate('mealParts.ingredient')
    .populate('user')
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

router.post('/api/meals', checkAuth, (req, res, next) => {
  let meal = {
    mealParts: [{ ingredient: req.body.ingredientId, grams: req.body.amount }],
    mealType: req.body.mealType,
    date: moment()
      .add(2, 'hours')
      .utc()
      .toISOString(),
      user: req.userData.userId
  };
  meal = new MealUpdated(meal);
  meal.save();
  meal
    .populate('mealParts.ingredient')
    .populate('user')
    .execPopulate()
    .then(meal => {
      meal = {
        id: meal._id,
        mealParts: meal.mealParts,
        mealType: meal.mealType
      };
      res.status(201).json({
        message: 'Ingredient added',
        meal: meal
      });
    });
});

router.patch('/api/meals-update', checkAuth, (req, res, next) => {
  const mealId = req.body.mealId;
  const mealPartId = req.body.mealPartId;
  const amount = req.body.amount;
  MealUpdated.updateOne(
    { _id: mealId, 'mealParts._id': mealPartId },
    { $set: { 'mealParts.$.grams': amount } },
    { new: true }
  ).then(meal => {
    MealUpdated.findOne({ _id: mealId })
      .populate('mealParts.ingredient')
      .populate('user')
      .then(insideMeal => {
        const updatedIdInMeal = {
            id: insideMeal._id,
            mealType: insideMeal.mealType,
            mealParts: insideMeal.mealParts,
            date: insideMeal.date
          };
          res.status(201).json({
            message: 'Mal Updated',
            meal: updatedIdInMeal
          });
        });
  });
});

router.patch('/api/meals/:mealId', checkAuth, (req, res, next) => {
  MealUpdated.findOneAndUpdate(
    {
      _id: req.params.mealId
    },
    {
      $push: {
        mealParts: {
          ingredient: req.body.ingredientId,
          grams: req.body.amount
        }
      }
    },
    { new: true }
  )
    .populate('mealParts.ingredient')
    .populate('user')
    .then(meal => {
      const updatedIdInMeal = {
        id: meal._id,
        mealType: meal.mealType,
        mealParts: meal.mealParts,
        date: meal.date
      };
      res.status(201).json({
        message: 'Mal Updated',
        meal: updatedIdInMeal
      });
    });
});

router.delete('/api/meals/', checkAuth, (req, res, next) => {
  MealUpdated.findByIdAndUpdate(
    { _id: req.query.mealId },
    { $pull: { mealParts: { _id: req.query.mealPartId } } },
    { new: true }
  )
    .populate('mealParts.ingredient')
    .populate('user')
    .then(updatedMeals => {
      res.status(201).json({
        message: 'Meal Deleted',
        meals: updatedMeals
      });
    });
});

module.exports = router;
