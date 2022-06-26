const db = require('../db/connection')
const { DateTime } = require('luxon')
const { formatSqlNoteAsJs } = require('../utils/formatters')
exports.selectAllNotesByListId = async (
  listId,
  orderBy = 'date',
  orderDirection = 'desc'
) => {
  const orderCriteria = {
    note: 'note_id',
    date: 'timestamp',
    title: 'note_title',
    deadline: 'deadline',
    priority: 'priority',
  }

  const orderDirectionCriteria = {
    asc: 'ASC',
    desc: 'DESC',
  }
  const orderRequested = orderCriteria[orderBy]
  const orderDirectionRequested = orderDirectionCriteria[orderDirection]

  //Check the requested order is valid
  if (orderRequested === undefined || orderDirectionRequested == undefined) {
    return Promise.reject({ status: 400, message: 'Invalid request' })
  }

  //Validate ID formatting
  if (/\s/.test(listId)) {
    return Promise.reject({ status: 400, message: 'Invalid list requested' })
  }

  const queryString = `SELECT * FROM notes WHERE list_id = $1 ORDER BY ${orderRequested} ${orderDirectionRequested};`
  const { rows: notes } = await db.query(queryString, [listId])

  return {
    notes: notes.map((note) => {
      return formatSqlNoteAsJs(note)
    }),
  }
}

exports.insertNewNote = async (newNote) => {
  const noteColumns = {
    listId: 'string',
    noteTitle: 'string',
    noteText: 'string',
    timestamp: 'string',
    priority: 'number',
    deadline: 'string',
    complete: 'boolean',
  }
  const nullAllowed = ['deadline']
  //Check new note has all required values and they are the correct type
  if (Object.keys(newNote).length !== 7) {
    return Promise.reject({ status: 400, message: 'Invalid note format' })
  }
  //Only allows a note if the required field exists, if it matches the expected type
  //or is an optional null value
  for (key of Object.keys(newNote)) {
    if (
      noteColumns[key] === undefined ||
      (typeof newNote[key] !== noteColumns[key] &&
        newNote[key] !== null &&
        !nullAllowed.includes(key))
    ) {
      return Promise.reject({ status: 400, message: 'Invalid note format' })
    }
  }
  const queryString = `
  INSERT INTO notes 
  (list_id, note_title, note_text, timestamp, priority, deadline) 
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `
  const {
    rows: [note],
  } = await db.query(queryString, [
    newNote.listId,
    newNote.noteTitle,
    newNote.noteText,
    newNote.timestamp,
    newNote.priority,
    newNote.deadline,
  ])

  return { note: formatSqlNoteAsJs(note) }
}

exports.patchNote = async (noteToUpdate) => {
  const noteColumns = {
    noteId: 'number',
    listId: 'string',
    noteTitle: 'string',
    noteText: 'string',
    timestamp: 'string',
    priority: 'number',
    deadline: 'string',
    complete: 'boolean',
  }
  const nullAllowed = ['deadline']

  //Check updated note has all required values and they are the correct type
  if (Object.keys(noteToUpdate).length !== 8) {
    return Promise.reject({ status: 400, message: 'Invalid note format' })
  }
  for (key of Object.keys(noteToUpdate)) {
    if (
      noteColumns[key] === undefined ||
      (typeof noteToUpdate[key] !== noteColumns[key] &&
        noteToUpdate[key] !== null &&
        !nullAllowed.includes(key))
    ) {
      return Promise.reject({ status: 400, message: 'Invalid note format' })
    }
  }
  //Check that note to be updated exists
  const { rows: existingNotes } = await db.query(
    'SELECT * FROM notes WHERE note_id = $1',
    [noteToUpdate.noteId]
  )

  if (existingNotes.length !== 1) {
    return Promise.reject({ status: 404, message: 'Note not found' })
  }

  const queryString = `
  UPDATE notes
  SET note_title = $1, note_text = $2, priority = $3, deadline = $4, complete = $5
  WHERE note_id = $6 RETURNING *;
  `
  const {
    rows: [note],
  } = await db.query(queryString, [
    noteToUpdate.noteTitle,
    noteToUpdate.noteText,
    noteToUpdate.priority,
    DateTime.fromISO(noteToUpdate.deadline).toSQL(),
    noteToUpdate.complete,
    noteToUpdate.noteId,
  ])

  return { note: formatSqlNoteAsJs(note) }
}

exports.deleteNote = async (noteToDelete) => {
  const noteColumns = {
    noteId: 'number',
    listId: 'string',
  }

  if (Number.isNaN(noteToDelete.noteId)) {
    return Promise.reject({ status: 404, message: 'Note not found' })
  }

  for (key of Object.keys(noteToDelete)) {
    if (
      noteColumns[key] === undefined ||
      typeof noteToDelete[key] !== noteColumns[key]
    ) {
      return Promise.reject({ status: 404, message: 'Note not found' })
    }
  }

  const { rows: existingNotes } = await db.query(
    'SELECT * FROM notes WHERE note_id = $1 AND list_id = $2',
    [noteToDelete.noteId, noteToDelete.listId]
  )

  if (existingNotes.length !== 1) {
    return Promise.reject({ status: 404, message: 'Note not found' })
  }

  const queryString = `
  DELETE from notes
  WHERE note_id = $1 AND list_id = $2 RETURNING *;
  `
  const {
    rows: [note],
  } = await db.query(queryString, [noteToDelete.noteId, noteToDelete.listId])

  return { note: formatSqlNoteAsJs(note) }
}
