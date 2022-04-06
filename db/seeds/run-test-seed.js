const testData = require('../test-data/notes')
const seed = require('./seed.js')
const db = require('../connection.js')

//For test builds, create the table and add the base data,
const runSeed = async () => {
    try {
        await seed(testData)
        db.end()

    } catch (error) {
        console.log('Error Seeding DB, ', error)
    }
}

runSeed()