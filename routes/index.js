const express = require('express');
const router = express.Router();

const Country = require('../model/countries');

/* GET home page. */
router.get('/', function(req, res, next) {
  const countries = Country.find({}, (err, data) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong" });
    } else {
      res.status(200).json(data);
    }
  })
});

router.get('/:country', (req, res) => {
  Country.find({name: new RegExp(`${req.params.country}$`, 'i')}, (err, data) => {
    if (err) {
      res.status(500).json({message: 'Data not found'});
    } else {
      res.status(200).json(data);
    }
  })
});


module.exports = router;
