// config/database.js
const { Client } = require("pg");

require("dotenv").config();

// const client = new Client({
//   user: "postgres",
//   password: process.env.POSTGRES_PASSWORD,
//   host: "localhost",
//   port: 5432,
//   database: "threads_db",
// });

// const client = new Client({
//   connectionString: `postgresql://postgres.auckcpjwdzammqaabubc:${process.env.POSTGRES_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
// });

// how to connect: connect => type => choose node.js => copy URL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  await client
    .connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Connection error", err.stack));
})();

module.exports = client;
