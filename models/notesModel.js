const db = require("../db/connection")

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
