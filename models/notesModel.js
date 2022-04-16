const db = require("../db/connection")
const luxon = require("luxon")
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
  console.log(`Model receieved ${orderBy} ${orderDirection} `)
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

  return {note}

}
