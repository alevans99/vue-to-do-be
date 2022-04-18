db = require("../connection");

const seed = async (data) => {
  const noteData = data;

  try {
    await db.query("DROP TABLE IF EXISTS notes;");
    await db.query(
      `CREATE TABLE notes (
                note_id SERIAL PRIMARY KEY,
                list_id TEXT NOT NULL,
                note_title TEXT NOT NULL,
                note_text TEXT NOT NULL,
                timestamp TIMESTAMP NOT NULL,
                priority INTEGER DEFAULT 2,
                deadline TIMESTAMP NOT NULL
            );`
    );
    const notesToInsert = noteData;
    const insertRequests = [];

    notesToInsert.forEach((note) => {

      insertRequests.push(
        db.query(
          `
            INSERT INTO notes (list_id, note_title, note_text, timestamp, priority, deadline)
            VALUES ($1, $2, $3, $4, $5, $6);`,
          [
            `${note.listId}`,
            `${note.noteTitle}`,
            `${note.noteText}`,
            note.timestamp,
            note.priority,
            note.deadline,
          ]
        )
      );
    });

    return await Promise.all(insertRequests);
  } catch (error) {
    console.log(`Error Seeding DB, ${error}`);
  }
};

module.exports = seed;
