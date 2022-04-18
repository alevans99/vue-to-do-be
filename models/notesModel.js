const db = require("../db/connection")
const { DateTime } = require("luxon")
exports.selectAllNotesByListId = async (
  listId,
  orderBy = "date",
  orderDirection = "desc"
) => {
  const orderCriteria = {
    note: "note_id",
    date: "timestamp",
    title: "note_title",
    deadline: "deadline",
    priority: "priority",
  }

  const orderDirectionCriteria = {
    asc: "ASC",
    desc: "DESC",
  }
  const orderRequested = orderCriteria[orderBy]
  const orderDirectionRequested = orderDirectionCriteria[orderDirection]

  //Check the requested order is valid
  if (orderRequested === undefined || orderDirectionRequested == undefined) {
    return Promise.reject({ status: 400, message: "Invalid request" })
  }

  //Validate ID formatting
  if (/\s/.test(listId)) {
    return Promise.reject({ status: 400, message: "Invalid list requested" })
  }

  const queryString = `SELECT * FROM notes WHERE list_id = $1 ORDER BY ${orderRequested} ${orderDirectionRequested};`
  const { rows: notes } = await db.query(queryString, [listId])

  return { notes }
}

exports.insertNewNote = async (newNote) => {
  const noteColumns = {
    listId: "string",
    title: "string",
    text: "string",
    timestamp: "string",
    priority: "number",
    deadline: "string",
  }

  //Check new note has all required values and they are the correct type
  if (Object.keys(newNote).length !== 6) {
    return Promise.reject({ status: 400, message: "Invalid note format" })
  }
  for (key of Object.keys(newNote)) {
    if (
      noteColumns[key] === undefined ||
      typeof newNote[key] !== noteColumns[key]
    ) {
      return Promise.reject({ status: 400, message: "Invalid note format" })
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
    newNote.title,
    newNote.text,
    newNote.timestamp,
    newNote.priority,
    newNote.deadline,
  ])

  return { note }
}

exports.patchNote = async (noteToInsert) => {
  const noteColumns = {
    noteId: "number",
    listId: "string",
    title: "string",
    text: "string",
    timestamp: "string",
    priority: "number",
    deadline: "string",
  }

  //Check updated note has all required values and they are the correct type
  if (Object.keys(noteToInsert).length !== 7) {
    return Promise.reject({ status: 400, message: "Invalid note format" })
  }
  for (key of Object.keys(noteToInsert)) {
    if (
      noteColumns[key] === undefined ||
      typeof noteToInsert[key] !== noteColumns[key]
    ) {
      return Promise.reject({ status: 400, message: "Invalid note format" })
    }
  }
  //Check that note to be updated exists
  const { rows: existingNotes } = await db.query(
    "SELECT * FROM notes WHERE note_id = $1",
    [noteToInsert.noteId]
  )

  if (existingNotes.length !== 1) {
    return Promise.reject({ status: 400, message: "Invalid note" })
  }

  const queryString = `
  UPDATE notes
  SET note_title = $1, note_text = $2, priority = $3, deadline = $4
  WHERE note_id = $5 RETURNING *;
  `
  const {
    rows: [note],
  } = await db.query(queryString, [
    noteToInsert.title,
    noteToInsert.text,
    noteToInsert.priority,
    DateTime.fromISO(noteToInsert.deadline).toSQL(),
    noteToInsert.noteId,
  ])

  return { note }
}

exports.deleteNote = async (noteToDelete) => {
  const noteColumns = {
    noteId: "number",
    listId: "string",
  }

  for (key of Object.keys(noteToDelete)) {
    if (
      noteColumns[key] === undefined ||
      typeof noteToDelete[key] !== noteColumns[key]
    ) {
      return Promise.reject({ status: 404, message: "Note not found" })
    }
  }

  const { rows: existingNotes } = await db.query(
    "SELECT * FROM notes WHERE note_id = $1 AND list_id = $2",
    [noteToDelete.noteId, noteToDelete.listId]
  )

  if (existingNotes.length !== 1) {
    return Promise.reject({ status: 404, message: "Note not found" })
  }

  const queryString = `
  DELETE from notes
  WHERE note_id = $1 AND list_id = $2 RETURNING *;
  `
  const {
    rows: [note],
  } = await db.query(queryString, [noteToDelete.noteId, noteToDelete.listId])

  return { note }
}
