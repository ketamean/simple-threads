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

const client = new Client({
  connectionString: `postgresql://postgres.auckcpjwdzammqaabubc:${process.env.POSTGRES_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
});

(async () => {
  await client
    .connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Connection error", err.stack));
})();

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100),
    bio TEXT,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS Threads (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS Followers (
    id SERIAL PRIMARY KEY,
    follower_id INT NOT NULL REFERENCES Users(id),
    following_id INT NOT NULL REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS Likes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    thread_id INT NOT NULL REFERENCES Threads(id),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS Comments (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL REFERENCES Threads(id),
    user_id INT NOT NULL REFERENCES Users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS Notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    image_url VARCHAR(255) NOT NULL,   
    header VARCHAR(50) NOT NULL,   
    type VARCHAR(50) NOT NULL,
    related_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

client
  .query(createTablesQuery)
  .then(() => console.log("Tables created successfully"))
  .catch((err) => console.error("Error creating tables", err.stack));

module.exports = client;
