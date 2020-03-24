const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  states: [
    {
      name: String,
      cases: Number
    }
  ]
})

module.exports = mongoose.model('Country', countrySchema);