const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio');
const router = express.Router();

const Country = require('../model/countries');

const url = 'https://covid19.ncdc.gov.ng/';

const trimText = text => {
  return JSON.parse(JSON.stringify(text).replace(/\\n/g, ''));
}

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

router.get('/nigeria', (req, response) => {
  axios(url).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const table = $('#custom3 > tbody > tr');
    const total = [];
    table.each((index, tr) => {
      if (index !== 0) {
        const stateName = $(tr).find('td:nth-child(1)').text();
        const cases = $(tr).find('td:nth-child(3)').text();
        total.push({
          name: trimText(stateName),
          cases: parseInt(trimText(cases))
        });
      }
    })
    response.status(200).json(total);
  }).catch(err => {
    response.status(500).json({ message: 'Data not found' });
  })
})

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
