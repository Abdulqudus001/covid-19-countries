const express = require('express');
const countryLists = require('countrycitystatejson');
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

module.exports = router;
