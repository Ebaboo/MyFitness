const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ingredientsRoute = require('./routes/ingredients')
const mealsRoute = require('./routes/meals')
const userRoute = require('./routes/user')
const weightRoute = require('./routes/weight')

const app = express();

mongoose
  .connect(
    // 'mongodb://localhost/MyFitness',
    'mongodb://Biashka:Biashka1985@146.185.141.230:27017/myfoody',
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
app.use("/", express.static(path.join(__dirname, "myfoody")));



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
app.use(weightRoute);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "myfoody", "index.html" ));
});


module.exports = app;
