const notesRouter = require('express').Router()
const { handleMethodNotAllowed } = require('../controllers/errorsController')
const {
  getAllNotesByListId,
  addNewNote,
  updateNote,
  removeNoteById,
} = require('../controllers/notesController')

notesRouter.route('/').all(handleMethodNotAllowed)

notesRouter
  .route('/:list_id')
  .get(getAllNotesByListId)
  .post(addNewNote)
  .patch(updateNote)
  .all(handleMethodNotAllowed)

notesRouter
  .route('/:list_id/:note_id')
  .delete(removeNoteById)
  .all(handleMethodNotAllowed)

module.exports = notesRouter
