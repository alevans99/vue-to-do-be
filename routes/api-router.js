const notesRouter = require('./notes-router')

const apiRouter = require('express').Router()

apiRouter
    .route('/')
    .get(async (req, res, next) => {
        console.log('HERE!')
        res.status(200).send({"message": "Connected to the API"})

    })
apiRouter.use('/notes', notesRouter)

module.exports = apiRouter