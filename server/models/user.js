let { sleep } = require('../utilities')
let mongoose = require('mongoose')
let Schema = mongoose.Schema
const bcrypt = require('bcryptjs'),
  SALT_WORK_FACTOR = 10,
  MAX_LOGIN_ATTEMPTS = 5

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  loginAttempts: { type: Number, required: true, default: 0 }
})

userSchema.pre('save', function(next) {
  let user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.incLoginAttempts = function(cb) {
  // we're incrementing
  let updates = { $inc: { loginAttempts: 1 } }
  // set loginAttempts to max
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
    updates = { $set: { loginAttempts: MAX_LOGIN_ATTEMPTS } }
  }
  return this.updateOne(updates, cb)
}

// custom toJSON method to remove unwanted keys
userSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  delete obj.loginAttempts
  return obj
}

userSchema.statics.getAuthenticated = function(username, password, cb) {
  this.findOne({ username: username }, async (err, user) => {
    if (err) return cb(err)

    // make sure the user exists
    if (!user) {
      return cb(null, null)
    }

    // check loginAttempts
    if (user.loginAttempts) {
      // prevent brute force by making it harder for attacker
      await Math.pow(2, user.loginAttempts)
    }

    // test for a matching password
    user.comparePassword(password, (err, isMatch) => {
      if (err) return cb(err)

      // check if the password was a match
      if (isMatch) {
        // reset attempts
        var updates = {
          $set: { loginAttempts: 0 }
        }
        return user.updateOne(updates, err => {
          if (err) return cb(err)
          return cb(null, user)
        })
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(err => {
        if (err) return cb(err)
        return cb(null, null)
      })
    })
  })
}

let User = (module.exports = mongoose.model('User', userSchema))
