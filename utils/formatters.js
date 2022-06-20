exports.formatSqlNoteAsJs = (sqlNote) => {
  return {
    noteId: sqlNote.note_id,
    listId: sqlNote.list_id,
    noteTitle: sqlNote.note_title,
    noteText: sqlNote.note_text,
    timestamp: sqlNote.timestamp,
    priority: sqlNote.priority,
    deadline: sqlNote.deadline,
    complete: sqlNote.complete,
  }
}

exports.formatJsNoteAsSql = (jsNote) => {
  return {
    note_id: jsNote.noteId,
    list_id: jsNote.listId,
    note_title: jsNote.noteTitle,
    note_text: jsNote.noteText,
    timestamp: jsNote.timestamp,
    priority: jsNote.priority,
    deadline: jsNote.deadline,
    complete: jsNote.complete,
  }
}
