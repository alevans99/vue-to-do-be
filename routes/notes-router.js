const notesRouter = require('express').Router()
const { getAllNotesByListId, addNewNote } = require('../controllers/notesController')

notesRouter
.route("/")
.post(addNewNote)

notesRouter
.route("/:list_id")
.get(getAllNotesByListId)




module.exports = notesRouter