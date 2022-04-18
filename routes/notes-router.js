const notesRouter = require('express').Router()
const { getAllNotesByListId, addNewNote, updateNote } = require('../controllers/notesController')

notesRouter
.route("/")
.post(addNewNote)
.patch(updateNote)

notesRouter
.route("/:list_id")
.get(getAllNotesByListId)




module.exports = notesRouter