const db = require('../db/connection')
const testData = require('../db/test-data/notes')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')
const { DateTime } = require('luxon')

//Every time the tests are run, the test DB is dropped and repopulated
//with the test data. The DB connection is ended on test completion.
beforeEach(() => {
  return seed(testData)
})
afterAll(() => {
  return db.end()
})

//Tests are organised by route, with each Request type nested within each.
describe('app.js', () => {
  describe('/api', () => {
    describe('GET', () => {
      it('should send a connected message with 200 status', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body: { message } }) => {
            expect(message).toBe('Connected to the API')
          })
      })
    })

    describe('POST', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .post('/api')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('PATCH', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .patch('/api')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('DELETE', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .delete('/api')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })
  })

  describe('/api/notes', () => {
    describe('POST', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .post('/api/notes')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('PATCH', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .patch('/api/notes')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })
    describe('DELETE', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .delete('/api/notes')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('GET', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .get('/api/notes')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })
  })

  describe('/api/notes/:list_id', () => {
    describe('GET', () => {
      it('should return a 200 status with a list of notes', () => {
        return request(app)
          .get('/api/notes/test')
          .expect(200)
          .then(({ body: { notes } }) => {
            expect(notes).toHaveLength(2)
            notes.forEach((note) => {
              expect(Object.keys(note)).toHaveLength(8)
              expect(note).toMatchObject({
                noteId: expect.any(Number),
                listId: expect.any(String),
                noteTitle: expect.any(String),
                noteText: expect.any(String),
                timestamp: expect.any(String),
                priority: expect.any(Number),
                deadline: expect.any(String),
                complete: expect.any(Boolean),
              })
            })
          })
      })

      it('should return the notes ascending by descending date by default', () => {
        return request(app)
          .get('/api/notes/test')
          .then(({ body: { notes } }) => {
            let referenceDate = ''
            let orderedByDate = true
            for (note of notes) {
              if (referenceDate === '') {
                referenceDate = note.timestamp
              }
              if (note.timestamp > referenceDate) {
                orderedByDate = false
              }
              referenceDate = note.timestamp
            }
            expect(orderedByDate).toBe(true)
          })
      })

      it('should allow queries to change the order direction of the results', () => {
        return request(app)
          .get('/api/notes/test?order=asc')
          .then(({ body: { notes } }) => {
            let referenceDate = ''
            let orderedByDate = true
            for (note of notes) {
              if (referenceDate === '') {
                referenceDate = note.timestamp
              }
              if (note.timestamp < referenceDate) {
                orderedByDate = false
              }
              referenceDate = note.timestamp
            }
            expect(orderedByDate).toBe(true)
          })
      })

      it('should allow queries to sort by title', () => {
        return request(app)
          .get('/api/notes/test?order=asc&order_by=title')
          .then(({ body: { notes } }) => {
            let referenceTitle = ''
            let orderedByTitle = true

            for (note of notes) {
              if (referenceTitle === '') {
                referenceTitle = note.note_title
              }
              if (note.note_title < referenceTitle) {
                orderedByTitle = false
              }
              referenceTitle = note.note_title
            }
            expect(orderedByTitle).toBe(true)
          })
      })

      it('should allow queries to sort by priority', () => {
        return request(app)
          .get('/api/notes/test?order=desc&order_by=priority')
          .then(({ body: { notes } }) => {
            let referencePriority = -1
            let orderedByPriority = true

            for (note of notes) {
              if (referencePriority === -1) {
                referencePriority = note.priority
              }
              if (note.priority > referencePriority) {
                orderedByPriority = false
              }
              referencePriority = note.priority
            }
            expect(orderedByPriority).toBe(true)
          })
      })

      it('should allow queries to sort by deadline', () => {
        return request(app)
          .get('/api/notes/test?order=asc&order_by=deadline')
          .then(({ body: { notes } }) => {
            let referenceDate = ''
            let orderedByDate = true
            for (note of notes) {
              if (referenceDate === '') {
                referenceDate = note.deadline
              }
              if (note.deadline < referenceDate) {
                orderedByDate = false
              }
              referenceDate = note.deadline
            }
            expect(orderedByDate).toBe(true)
          })
      })

      it('Should send an error message with 400 status when incorrect order criteria supplied', () => {
        return request(app)
          .get('/api/notes/test?order=wrong')
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid request')
          })
      })

      it('Should send an error message with 400 status when incorrect order direction supplied', () => {
        return request(app)
          .get('/api/notes/test?order_by=wrong')
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid request')
          })
      })

      it('Should send an error message with 400 status when incorrect list formatting used', () => {
        return request(app)
          .get('/api/notes/test one')
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid list requested')
          })
      })
    })

    describe('DELETE', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .delete('/api/notes/test')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('POST', () => {
      it('should return a 201 status and the new note when posted', () => {
        return request(app)
          .post('/api/notes/test')
          .send({
            note: {
              listId: 'test',
              title: 'This is a new title from insomnia',
              text: 'Here is all the text from the insomnia test',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 1,
              deadline: '2022-04-18T17:30:00.000Z',
              complete: false,
            },
          })
          .expect(201)
          .then(({ body: { note } }) => {
            expect(Object.keys(note)).toHaveLength(8)
            expect(note).toMatchObject({
              noteId: expect.any(Number),
              listId: expect.any(String),
              noteTitle: expect.any(String),
              noteText: expect.any(String),
              timestamp: expect.any(String),
              priority: expect.any(Number),
              deadline: expect.any(String),
              complete: expect.any(Boolean),
            })
          })
      })
      it('should return a 400 status when the correct fields are not provided', () => {
        return request(app)
          .post('/api/notes/test')
          .send({
            note: {
              listId: 'test',
              text: 'Here is all the text from the insomnia test',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 1,
              deadline: '2022-04-18T17:30:00.000Z',
            },
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid note format')
          })
      })

      it('should return a 400 status when the incorrect field types are provided', () => {
        return request(app)
          .post('/api/notes/test')
          .send({
            note: {
              listId: 'test',
              title: 3,
              text: 'Here is all the text from the insomnia test',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 1,
              deadline: '2022-04-18T17:30:00.000Z',
              complete: 'true',
            },
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid note format')
          })
      })
    })

    describe('PATCH', () => {
      it('should return a 201 status and the updated note when patched', () => {
        return request(app)
          .patch('/api/notes/test')
          .send({
            note: {
              noteId: 1,
              listId: 'test',
              title: 'updated title',
              text: 'updated text',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 2,
              deadline: '2024-04-16T14:06:00.000Z',
              complete: true,
            },
          })
          .expect(201)
          .then(({ body: { note } }) => {
            expect(Object.keys(note)).toHaveLength(8)
            expect(note).toMatchObject({
              noteId: expect.any(Number),
              listId: expect.any(String),
              noteTitle: expect.any(String),
              noteText: expect.any(String),
              timestamp: expect.any(String),
              priority: expect.any(Number),
              deadline: expect.any(String),
              complete: expect.any(Boolean),
            })
            expect(note.noteId).toBe(1)
            expect(note.noteTitle).toBe('updated title')
            expect(note.noteText).toBe('updated text')
            expect(note.priority).toBe(2)
            expect(note.deadline).toBe('2024-04-16T14:06:00.000Z')
            expect(note.complete).toBe(true)
          })
      })

      it('should return a 400 status when missing a key', () => {
        return request(app)
          .patch('/api/notes/test')
          .send({
            note: {
              noteId: 1,
              listId: 'test',
              text: 'updated text',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 2,
              deadline: '2024-04-16T14:06:00.000Z',
            },
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid note format')
          })
      })

      it('should return a 400 status key is the wrong type', () => {
        return request(app)
          .patch('/api/notes/test')
          .send({
            note: {
              noteId: 1,
              title: 4,
              listId: 'test',
              text: 'updated text',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 2,
              deadline: '2024-04-16T14:06:00.000Z',
              complete: 'true',
            },
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid note format')
          })
      })

      it("should return a 404 status when trying to update a note that doesn't exist", () => {
        return request(app)
          .patch('/api/notes/test')
          .send({
            note: {
              noteId: 999,
              title: 'New Title',
              listId: 'test',
              text: 'updated text',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 2,
              deadline: '2024-04-16T14:06:00.000Z',
              complete: false,
            },
          })
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe('Note not found')
          })
      })

      it('should return a 400 status when including an incorrect key', () => {
        return request(app)
          .patch('/api/notes/test')
          .send({
            note: {
              noteId: 1,
              listId: 'test',
              incorrect: 'updated title',
              text: 'updated text',
              timestamp: '2022-04-16T14:06:00.000Z',
              priority: 2,
              deadline: '2024-04-16T14:06:00.000Z',
              complete: false,
            },
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe('Invalid note format')
          })
      })
    })
  })

  describe('/api/notes/:list_id/:note_id', () => {
    describe('DELETE', () => {
      it('should remove the note and return a 204 status', () => {
        return request(app)
          .delete('/api/notes/test/1')
          .expect(204)
          .then(() => {
            return request(app)
              .get('/api/notes/test')
              .expect(200)
              .then(({ body: { notes } }) => {
                expect(notes).toHaveLength(1)
              })
          })
      })

      it("should return a 404 status when trying to delete a note that doesn't exist", () => {
        return request(app)
          .delete('/api/notes/test/1000')
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe('Note not found')
          })
      })

      it('should return a 404 status when incorrect note ID provided', () => {
        return request(app)
          .delete('/api/notes/test/Wrong')
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe('Note not found')
          })
      })
    })

    describe('POST', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .post('/api/notes/test/1')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('PATCH', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .patch('/api/notes/test/1')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })

    describe('GET', () => {
      it('Should send an error message with 405 status', () => {
        return request(app)
          .get('/api/notes/test/1')
          .expect(405)
          .then(({ body: { message } }) => {
            expect(message).toBe('Method Not Allowed')
          })
      })
    })
  })
})
