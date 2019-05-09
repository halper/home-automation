const express = require('express')
const router = express.Router()
const HeaterLog = require('../../models/heaterLog')

// Get heater logs
router.get('/', (req, res) => {
  HeaterLog.find({}, (err, logs) => {
    if (err) console.log(err)
    res.send(logs)
  })
})

module.exports = router
