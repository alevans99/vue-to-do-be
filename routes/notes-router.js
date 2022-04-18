const notesRouter = require('express').Router()
const { getAllNotesByListId, addNewNote, updateNote, removeNoteById } = require('../controllers/notesController')

notesRouter
.route("/")
.post(addNewNote)
.patch(updateNote)

notesRouter
.route("/:list_id")
.get(getAllNotesByListId)


notesRouter
.route("/:list_id/:note_id")
.delete(removeNoteById)

module.exports = notesRouter