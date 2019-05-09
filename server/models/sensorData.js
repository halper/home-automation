let mongoose = require('mongoose')
let Schema = mongoose.Schema

let sensorDataSchema = Schema({
  sensorAddress: {
    type: String,
    required: true
  },
  sensorReading: {
    type: Schema.Types.Mixed,
    required: true
  },
  readingTime: {
    type: Date,
    required: true
  }
})

let SensorData = module.exports = mongoose.model('SensorData', sensorDataSchema, 'sensorData')
