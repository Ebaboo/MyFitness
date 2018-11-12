const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb://localhost/MyFitness',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch(e => {
    console.log(e);
  });

const Ingredient = require('./models/ingredient');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS'
  );
  next();
});

app.get('/api/ingredients', (req, res, next) => {
  const ingredients = {};
  Ingredient.find().then(documents => {
    res.status(200).json({
      message: 'Ingredients Fetched Successfully',
      ingredients: documents
    });
  });
});

app.post('/api/ingredients', (req, res, next) => {
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

app.put('/api/ingredients/:id', (req, res, next) => {
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

module.exports = app;
