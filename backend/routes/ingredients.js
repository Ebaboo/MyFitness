const express = require('express');
const Ingredient = require('../models/ingredient');
const router = express.Router();

router.get('/api/ingredients', (req, res, next) => {
  const ingredients = {};
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
  console.log(ingredient);
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
      console.log(ingredient)
      res.status(200).json(ingredient);
    } else {
      console.log('huy')
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
  console.log(req.body);
  Ingredient.updateOne({ _id: req.params.id }, ingredient).then(result => {
    res.status(200).json({
      message: 'Updated Successfully'
    });
  });
});

module.exports = router;
