/**
 * This sets up the database based on the current environment (test/production)
 */
const { Pool } = require('pg')

//Defaults to development it NODE_ENV not provided (will be set by Jest if testing)
const ENV = process.env.NODE_ENV || 'development'

//Point dotenv towards which environment variables we want to use
//(This will update which DB we use when switching between testing and production)
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
})

//Check that the database (set in .env) and db name (set in scripts) have been set.
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error(
    'Either the DB or the DB url has not been set in environment variables'
  )
}

//Only create a config for the DB Pool if we are in production. (we won't have
//a DB url if in test as we will use local DB)
const config =
  ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}

module.exports = new Pool(config)
