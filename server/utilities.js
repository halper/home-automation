const jwt = require('jsonwebtoken')
const { secret } = require('./config')

const utilities = {
  sleep: ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  verifyToken: (req, res, next) => {
    const bearerHeader =
      req.headers['x-access-token'] || req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.startsWith('Bearer ')
        ? bearerHeader.slice(7, bearerHeader.length)
        : bearerHeader
      if (token) {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            return res.sendStatus(403)
          } else {
            req.decoded = decoded
            next()
          }
        })
      } else {
        return res.sendStatus(403)
      }
    } else {
      res.sendStatus(403)
    }
  }
}

module.exports = utilities
