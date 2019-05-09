const express = require('express')
const router = express.Router()
const Precedence = require('../../models/precedence')

// Get precedence list
router.get('/', (req, res) => {
  Precedence.find({}, (err, precedence) =>{
    if (err) console.log(err)
    res.send(precedence)
  })
})

// Create a precedence
router.post('/', (req, res) => {
  req.body.startDate = new Date(req.body.startDate)
  req.body.endDate = new Date(req.body.endDate)
  let p = new Precedence(req.body)
  p.validate()
  p.save()
  res.sendStatus(201)
})

// Update a precedence
router.put('/', (req, res) => {
  let updateQuery = {}
  if (req.body.startDate) {
    updateQuery['startDate'] = new Date(req.body.startDate)
  }
  if (req.body.endDate) {
    updateQuery['endDate'] = new Date(req.body.endDate)
  }
  if (req.body.prefTemp) {
    updateQuery['prefTemp'] = req.body.prefTemp
  }
  if (req.body.sensorAddress) {
    updateQuery['sensorAddress'] = req.body.sensorAddress
  }
  Precedence.updateOne({_id: req.body._id}, updateQuery, (err, writeOpResult) => {
    if (err) console.log(err)
    res.sendStatus(204)
  })
})

module.exports = router
