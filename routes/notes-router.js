const notesRouter = require('express').Router()
const { getAllNotesByListId } = require('../controllers/notesController')
notesRouter
.route("/:list_id")
.get(getAllNotesByListId)



module.exports = notesRouter