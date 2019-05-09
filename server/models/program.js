let mongoose = require('mongoose')
let Schema = mongoose.Schema

let programSchema = Schema({
  weekDay: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  sensor: {
    type: String,
    required: true
  }
})

let Program = module.exports = mongoose.model('Program', programSchema, 'Program')


