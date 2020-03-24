const express = require('express');
const router = express.Router();

const Country = require('../model/countries');

let currentCountry = {};

router.get('/', (req, res) => {
  const countries = Country.find({}, (err, data) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong" });
    } else {
      const sortedData = data.sort((a, b) => a.name - b.name);
      res.render('update', {countries: sortedData});
    }
  })
})

router.get('/:name', (req, res) => {
  const country = Country.find({name: new RegExp(`${req.params.name}$`, 'i')}, (err, data) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong" });
    } else {
      currentCountry = data[0];
      res.render('updateCases', {country: data[0]});
    }
  });
})

router.post('/:name', (req, res) => {
  const country = Country.find({name: new RegExp(`${req.params.name}$`, 'i')}, (err, data) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong" });
    } else {
      currentCountry = data[0];
      const updatedData = req.body.count;
      updatedData.forEach((count, index) => {
        if (count) {
          currentCountry.states[index].cases = count;
        }
      });
      Country.update({ name: req.params.name }, { states: currentCountry.states }, (err, updated) => {
        if (err) {
          res.status(500).json({ message: "Something went wrong" });
        } else {
          res.redirect(`/update/${req.params.name}`)
        }
      })
    }
  });
});

module.exports = router;