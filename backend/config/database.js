// config/database.js
const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "threads_db",
});

(async () => {
  await client
    .connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Connection error", err.stack));
})();

module.exports = client;
