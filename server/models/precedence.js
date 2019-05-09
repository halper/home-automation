// Precedence collection temporarily overwrites any conflicting date/value from program collection

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let precedenceSchema = Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  prefTemp: {
    type: Number,
    required: true
  },
  sensorAddress: {
    type: String,
    required: true
  }
})

let Precedence = module.exports = mongoose.model('Precedence', precedenceSchema)
