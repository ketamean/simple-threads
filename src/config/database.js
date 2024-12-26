// config/database.js
const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  await client
    .connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Connection error", err.stack));
})();

const createTablesQuery = require('./db/genQueryCreateTables');
const createIndexesQuery = require('./db/genQueryCreateIndexes');

(async() => {
  try {
    await client.query(createTablesQuery);
    console.log("Tables created successfully");

    await client.query(createIndexesQuery);
    console.log("Indexes created successfully");
  } catch (err) {
    console.error("Error creating tables", err.stack);
  }
})();

module.exports = client;
