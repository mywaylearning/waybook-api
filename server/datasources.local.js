'use strict';

// we load values into the environment using dotenv.

module.exports = {
  db: {
    host: process.env.WAYBOOK_DB_HOST,
    user: process.env.WAYBOOK_DB_USER,
    password: process.env.WAYBOOK_DB_PASSWORD,
    ssl: (process.env.WAYBOOK_DB_SSL !== 'false' || undefined)
  }
};
