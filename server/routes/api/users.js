const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const config = require('../../config')

// Get users
router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) console.log(err)
    res.send(users, res)
  })
})

// Create a user
router.post('/', async (req, res) => {
  let user = new User(req.body)
  await user.validate()
  await user.save()
  delete user.password
  const token = jwt.sign({ user }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  })

  res.status(200).send({ auth: true, token })
})

// Login
router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err

    User.getAuthenticated(user.username, req.body.password, (err, user) => {
      if (err) console.log(err)

      if (user) {
        user = user.toJSON()
        const token = jwt.sign({ user }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        })

        res.status(200).send({ auth: true, token })
      } else {
        res.send({ auth: false })
      }
    })
  })
})

module.exports = router
