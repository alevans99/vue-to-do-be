const { handleMethodNotAllowed } = require('../controllers/errorsController')
const notesRouter = require('./notes-router')

const apiRouter = require('express').Router()

apiRouter
    .route('/')
    .get(async (req, res, next) => {
        res.status(200).send({"message": "Connected to the API"})
    })
    .all(handleMethodNotAllowed)

apiRouter.use('/notes', notesRouter)

module.exports = apiRouter