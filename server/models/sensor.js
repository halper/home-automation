let mongoose = require('mongoose')
let Schema = mongoose.Schema

let sensorSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'DHT22'
  },
  // Active, inactive
  status: {
    type: String,
    default: 'ACTIVE'
  },
})

let Sensor = module.exports = mongoose.model('Sensor', sensorSchema)
