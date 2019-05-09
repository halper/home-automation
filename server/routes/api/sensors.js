const express = require('express');
const router = express.Router();

const Sensor = require('../../models/sensor');
const SensorData = require('../../models/sensorData');

// Get sensors
router.get('/', (req, res) => {
  Sensor.find({}, function (err, sensors) {
    if (err) {
      console.log(err)
    }
    res.send(sensors)
  })
});

// Create a sensor
router.post('/', (req, res) => {
  let s = new Sensor(req.body)
  s.validate()
  s.save()
  res.status(201).send(s)
})

// Update a sensor
router.put('/', (req, res) => {
  let updateQuery = {}
  const body = req.body
  if (body.type) {
    updateQuery['type'] = body.type
  }
  if (body.status) {
    updateQuery['status'] = body.status
  }
  if (body.address){
    updateQuery['address'] = body.address
  }
  if (body.location) {
    updateQuery['location'] = body.location
  }
  Sensor.updateOne({_id: body._id}, updateQuery, (err, writeOp) => {
    if (err) console.log(err)
    res.sendStatus(204)
  })
})

// Get data with given date range (required) and sensorAddress (opt)
router.get('/data', (req, res) => {
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)
  let query = {
    readingTime: { $gte: startDate, $lte: endDate}
  }
  if (req.body.sensorAddress) {
    query['sensorAddress'] = req.body.sensorAddress;
  }
  SensorData.find(query, (err, sensorData) => {
    if (err) console.log(err);
    res.send(sensorData)
  });
})

// Get sensor
router.get('/:address', (req, res) => {
  Sensor.find({address: req.params.address}, (err, sensor) => {
    if (err) console.log(err);
    res.send(sensor)
  })
})

module.exports = router;
