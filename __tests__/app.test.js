const db = require("../db/connection")
const testData = require("../db/test-data/notes")
const seed = require("../db/seeds/seed")
const request = require("supertest")
const app = require("../app")
const {DateTime} = require('luxon')

//Every time the tests are run, the test DB is dropped and repopulated
//with the test data. The DB connection is ended on test completion.
beforeEach(() => {
  return seed(testData)
})
afterAll(() => {
  return db.end()
})

//Tests are organised by route, with each Request type nested within each.
describe("app.js", () => {
  describe("/api", () => {
    describe("GET", () => {
      it("should send a connected message with 200 status", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body: { message } }) => {
            expect(message).toBe("Connected to the API")
          })
      })
    })
  })

  describe('/api/notes', () => {
    
    describe('POST', () => {
      it('should return a 201 status and the new note when posted', () => {
        return request(app)
        .post("/api/notes")
        .send({
          "note": {
            "listId": "test",
            "title": "This is a new title from insomnia",
            "text": "Here is all the text from the insomnia test",
            "timestamp": "2022-04-16T14:06:00.000Z",
            "priority": 1,
            "deadline": "2022-04-18T17:30:00.000Z"
          }
        })
        .expect(201)
        .then(({ body: { note } }) => {
          expect(Object.keys(note)).toHaveLength(7)
            expect(note).toMatchObject({
              note_id: expect.any(Number),
              list_id: expect.any(String),
              note_title: expect.any(String),
              note_text: expect.any(String),
              timestamp: expect.any(String),
              priority: expect.any(Number),
              deadline: expect.any(String),
            })
        })
      });
    });

    describe('PATCH', () => {
      it('should return a 201 status and the updated note when patched', () => {

        return request(app)
        .patch("/api/notes")
        .send({
          "note": {
            "noteId": 1,
            "listId": "test",
            "title": "updated title",
            "text": "updated text",
            "timestamp": "2022-04-16T14:06:00.000Z",
            "priority": 2,
            "deadline": "2024-04-16T14:06:00.000Z"
          }
        })
        .expect(201)
        .then(({ body: { note } }) => {
          expect(Object.keys(note)).toHaveLength(7)
            expect(note).toMatchObject({
              note_id: expect.any(Number),
              list_id: expect.any(String),
              note_title: expect.any(String),
              note_text: expect.any(String),
              timestamp: expect.any(String),
              priority: expect.any(Number),
              deadline: expect.any(String),
            })
            expect(note.note_id).toBe(1)
            expect(note.note_title).toBe('updated title')
            expect(note.note_text).toBe('updated text')
            expect(note.priority).toBe(2)
            expect(note.deadline).toBe("2024-04-16T14:06:00.000Z")


        })
      });
    });



  });

  describe("/api/notes/:list_id", () => {

    describe("GET", () => {
      it("should return a 200 status with a list of notes", () => {
        return request(app)
          .get("/api/notes/test")
          .expect(200)
          .then(({ body: { notes } }) => {
            expect(notes).toHaveLength(2)
            notes.forEach((note) => {
              expect(Object.keys(note)).toHaveLength(7)
              expect(note).toMatchObject({
                note_id: expect.any(Number),
                list_id: expect.any(String),
                note_title: expect.any(String),
                note_text: expect.any(String),
                timestamp: expect.any(String),
                priority: expect.any(Number),
                deadline: expect.any(String),
              })
            })
          })
      })

      it('should return the notes ascending by descending date by default', () => {
        return request(app)
        .get("/api/notes/test")
        .then(({ body: { notes } }) => {
            let referenceDate = ''
            let orderedByDate = true
            for (note of notes){
                if (referenceDate === ''){
                    referenceDate = note.timestamp
                }
                if (note.timestamp > referenceDate){
                    orderedByDate = false
                }
                referenceDate = note.timestamp
            }
            expect(orderedByDate).toBe(true)

        })
          
      });

      it('should allow queries to change the order direction of the results', () => {
        return request(app)
        .get("/api/notes/test?order=asc")
        .then(({ body: { notes } }) => {
            let referenceDate = ''
            let orderedByDate = true
            for (note of notes){
                if (referenceDate === ''){
                    referenceDate = note.timestamp
                }
                if (note.timestamp < referenceDate){
                    orderedByDate = false
                }
                referenceDate = note.timestamp
            }
            expect(orderedByDate).toBe(true)

        })
          
      });

      it('should allow queries to sort by title', () => {
        return request(app)
        .get("/api/notes/test?order=asc&order_by=title")
        .then(({ body: { notes } }) => {
            let referenceTitle = ''
            let orderedByTitle = true

            for (note of notes){
                if (referenceTitle === ''){
                    referenceTitle = note.note_title
                }
                if (note.note_title < referenceTitle){
                    orderedByTitle = false
                }
                referenceTitle = note.note_title
            }
            expect(orderedByTitle).toBe(true)

        })
          
      });

      it('should allow queries to sort by priority', () => {
        return request(app)
        .get("/api/notes/test?order=desc&order_by=priority")
        .then(({ body: { notes } }) => {
            let referencePriority = -1
            let orderedByPriority = true

            for (note of notes){
                if (referencePriority === -1){
                  referencePriority = note.priority
                }
                if (note.priority > referencePriority){
                  orderedByPriority = false
                }
                referencePriority = note.priority
            }
            expect(orderedByPriority).toBe(true)

        })
          
      });

      it('should allow queries to sort by deadline', () => {
        return request(app)
        .get("/api/notes/test?order=asc&order_by=deadline")
        .then(({ body: { notes } }) => {
            let referenceDate = ''
            let orderedByDate = true
            for (note of notes){
                if (referenceDate === ''){
                    referenceDate = note.deadline
                }
                if (note.deadline < referenceDate){
                    orderedByDate = false
                }
                referenceDate = note.deadline
            }
            expect(orderedByDate).toBe(true)

        })
          
      });

    })


    describe('/api/notes/:list_id/:note_id', () => {
      
      describe('DELETE', () => {
        it('should remove the note and return a 204 status', () => {
          
          return request(app)
          .delete("/api/notes/test/1")
          .expect(204)
          .then(() => {
            return request(app)
            .get("/api/notes/test")
            .expect(200)
            .then(({ body: { notes } }) => {
              expect(notes).toHaveLength(1)
            })
          })

        });
      });

    });

  })
})
