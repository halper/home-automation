const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const mongoose = require('mongoose');

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// DB connection
const dbConf = require('./config')
const connectionString = `mongodb+srv://${dbConf.username}:${dbConf.password}@${dbConf.host}/${dbConf.db}`
mongoose.connect(connectionString, { useNewUrlParser: true })
let db = mongoose.connection

// Check connection
db.once('open', function() {
  console.log('Connected to the MongoDB')
});

// Check for DB errors
db.on('error', function(err){
  console.log(err)
})

// Middleware
app.use(bodyParser.json());
app.use(cors())


// Routes
const sensors = require('./routes/api/sensors');
const program = require('./routes/api/program');
const precedence = require('./routes/api/precedence');
const heater = require('./routes/api/heater');

app.use('/api/sensors', sensors);
app.use('/api/program', program);
app.use('/api/precedence', precedence);
app.use('/api/heater', heater);

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
