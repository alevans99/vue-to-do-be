const { selectAllNotesByListId } = require("../models/notesModel")

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
