const express = require('express');
const Ingredient = require('../models/ingredient');
const router = express.Router();

router.get('/api/ingredients', (req, res, next) => {
  Ingredient.find().then(documents => {
    res.status(200).json({
      message: 'Ingredients Fetched Successfully',
      ingredients: documents
    });
  });
});

router.post('/api/ingredients', (req, res, next) => {
  const ingredient = new Ingredient({
    name: req.body.name,
    calories: req.body.calories
  });
  ingredient.save().then(createdIngredient => {
    res.status(201).json({
      message: 'Ingredient added',
      ingredientId: createdIngredient._id
    });
  });
});

router.get('/api/ingredients/:id', (req, res, next) => {
  Ingredient.findById(req.params.id).then(ingredient => {
    if (ingredient) {
      res.status(200).json(ingredient);
    } else {
      res.status(404).json({message: 'Ingredient not found'})
    }
  });
});

router.put('/api/ingredients/:id', (req, res, next) => {
  const ingredient = new Ingredient({
    _id: req.params.id,
    name: req.body.ingredientName,
    calories: req.body.ingredientCalories
  });
  Ingredient.findOneAndUpdate({ _id: req.params.id }, ingredient, {new: true}).then(result => {
    res.status(200).json({
      message: 'Updated Successfully',
      ingredient: result
    });
  });
});

module.exports = router;
