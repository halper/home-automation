const express = require('express')
const router = express.Router()
const Program = require('../../models/program')


// Get the program
router.get('/', (req, res) => {
  Program.find({}, (err, program) => {
    if (err) console.log(err)
    res.send(program)
  })
})

// Create a program record
router.post('/', (req, res) => {
  let p = new Program(req.body)
  p.validate()
  p.save()
  res.sendStatus(201)
})


// Update the program
router.put('/', (req, res) => {
  let updateQuery = {}
  if (req.body.weekDay) {
    updateQuery['weekDay'] = req.body.weekDay
  }
  if (req.body.startTime) {
    updateQuery['startTime'] = req.body.startTime
  }
  if (req.body.endTime) {
    updateQuery['endTime'] = req.body.endTime
  }
  if (req.body.sensor) {
    updateQuery['sensor'] = req.body.sensor
  }
  Program.updateOne({_id: req.body._id}, updateQuery, (err, writeOpResult) => {
    if (err) console.log(err)
    res.sendStatus(204)
  })
})

// Delete the program

module.exports = router;
