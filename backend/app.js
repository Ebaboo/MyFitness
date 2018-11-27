const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ingredientsRoute = require('./routes/ingredients')
const mealsRoute = require('./routes/meals')
const userRoute = require('./routes/user.js')

const app = express();

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS'
  );
  next();
});

app.use(ingredientsRoute);
app.use(mealsRoute);
app.use('/api/user' , userRoute);

module.exports = app;
