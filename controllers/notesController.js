const { selectAllNotesByListId, insertNewNote } = require("../models/notesModel")

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
    console.log('here I am' , req.body.note)
    const noteToAdd = req.body.note
    const addedNote = await insertNewNote(noteToAdd)
    res.status(201).send(addedNote)
  } catch (error) {
    next(error)
  }
}