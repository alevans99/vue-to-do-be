const {
  selectAllNotesByListId,
  insertNewNote,
  patchNote,
  deleteNote,
} = require('../models/notesModel')
const { DateTime } = require('luxon')
exports.getAllNotesByListId = async (req, res, next) => {
  try {
    const { list_id: listId } = req.params
    const { order: orderDirection, order_by: orderBy } = req.query
    const notes = await selectAllNotesByListId(listId, orderBy, orderDirection)
    res.status(200).send(notes)
  } catch (error) {
    next(error)
  }
}

exports.addNewNote = async (req, res, next) => {
  try {
    const noteToAdd = req.body.note
    const addedNote = await insertNewNote(noteToAdd)
    res.status(201).send(addedNote)
  } catch (error) {
    next(error)
  }
}

exports.updateNote = async (req, res, next) => {
  try {
    const noteToUpdate = req.body.note
    const updatedNote = await patchNote(noteToUpdate)

    res.status(201).send(updatedNote)
  } catch (error) {
    next(error)
  }
}

exports.removeNoteById = async (req, res, next) => {
  try {
    const { note_id, list_id: listId } = req.params

    const noteId = Number(note_id)
    await deleteNote({ noteId, listId })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
