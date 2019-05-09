let mongoose = require('mongoose')
let Schema = mongoose.Schema

let heaterLogSchema = Schema({
  // On, Off
  status: {
    type: String,
    required: true
  },
  // When the status is changed
  setTime: {
    type: Date,
    required: true
  },
  // Preferred ambient temp from program
  prefTemp: {
    type: Number,
    required: true
  },
  // Current temp of the room
  currentTemp: {
    type: Number,
    required: true
  },
  // Sensor address
  readSensor: {
    type: String,
    required: true
  }
})

let HeaterLog = module.exports = mongoose.model('HeaterLog', heaterLogSchema)
