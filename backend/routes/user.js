const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
      startWeight: req.body.startWeight
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User Saved!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message: 'No such user found!'
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Authantication failed!'
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        {
          expiresIn: '1h'
        }
      );
      res.status(200).json({
        message: 'Authantication succeed!',
        token: token,
        expiresIn: 3600,
        nickname: fetchedUser.nickname,
        startWeight: fetchedUser.startWeight
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Authantication failed!',
        error: err
      });
    });
});

module.exports = router;
