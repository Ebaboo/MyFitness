const express = require('express');
const router = express.Router();
const Weight = require('../models/weight');
const checkAuth = require('../middleware/check-auth');

const moment = require('moment');

router.get('/api/weight', checkAuth, (req, res, next) => {
  const gt = req.query.startDate;
  const lt = req.query.endDate;
  Weight.find({
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
    },
    user: req.userData.userId
  })
    .sort('date')
    .then(weight => {
      res.status(201).json({
        message: 'weight found',
        weightData: weight
      });
    });
});

router.post('/api/weight', checkAuth, (req, res, next) => {
  const now = moment(req.body.date, 'DD-MM-YYYY')
    .add(2, 'hours')
    .utc()
    .toISOString();
  const weight = new Weight({
    weight: req.body.weight,
    date: now,
    user: req.userData.userId
  });
  weight.save().then(weight =>
    res.status(201).json({
      message: 'Weight saved!',
      weight: weight
    })
  );
});

router.patch('/api/weight', (req, res, next) => {
  const weightId = req.body.weightId;
  const weight = req.body.amount;
  Weight.findOneAndUpdate({_id: weightId} , {weight: weight},
    { new: true }
  ).then(weight => {
    res.status(201).json({
      message: 'Weight updated!',
      weightData: weight
    });
  });
});

module.exports = router;
