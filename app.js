const express = require('express')
const apiRouter = require('./routes/api-router')
const cors = require('cors')
const {
  handleCustomErrors,
  handleDbErrors,
  handleServerErrors,
} = require('./controllers/errorsController')
const app = express()

//CORS
const corsConfig =
  ENV === 'production'
    ? {
        origin: 'http://localhost:8080',
        optionsSuccessStatus: 200,
      }
    : {}
app.use(cors(corsConfig))
app.use(express.json())
app.use('/api', apiRouter)

//Return error for non-supported routes
app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Path not found' })
})

//Handle all other errors
app.use(handleCustomErrors)
app.use(handleDbErrors)
app.use(handleServerErrors)

module.exports = app
