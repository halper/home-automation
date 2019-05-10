require('dotenv').config()

const config = {
  username: 'alper',
  password: process.env.DB_PWD,
  host: 'cluster0-0tvng.mongodb.net',
  db: 'homeaut',
  secret: process.env.SECRET
}

module.exports = config
