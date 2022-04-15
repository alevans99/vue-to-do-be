const db= require('../db/connection')
const testData = require('../db/test-data/notes')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')

//Every time the tests are run, the test DB is dropped and repopulated
//with the test data. The DB connection is ended on test completion.
beforeEach(() => { return seed(testData)})
afterAll(() => { return db.end()})

//Tests are organised by route, with each Request type nested within each.
describe('app.js', () => {
    
    describe('/api', () => {
        
        describe('GET', () => {
            it('should send a connected message with 200 status', () => {
                
                return request(app)
                    .get("/api")
                    .expect(200)
                    .then(({body: {message}}) => {
                        expect(message).toBe("Connected to the API")
                    })
            });
        });


    });

});