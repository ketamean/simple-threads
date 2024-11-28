// models/user.js
const client = require("../config/database");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fullname VARCHAR(100) NOT NULL
  )
`;

client
  .query(createTableQuery)
  .then(() => console.log("Users table created successfully"))
  .catch((err) => console.error("Error creating users table", err.stack));

// Định nghĩa các phương thức cho model User
const User = {
  create: async (userData) => {
    const { username, password, email, fullname } = userData;
    const query = `
      INSERT INTO users (username, password, email, fullname)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [username, password, email, fullname];
    try {
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error creating user", err.stack);
      throw err;
    }
  },

  findById: async (userid) => {
    const query = "SELECT * FROM users WHERE userid = $1";
    try {
      const res = await client.query(query, [userid]);
      return res.rows[0];
    } catch (err) {
      console.error("Error finding user by ID", err.stack);
      throw err;
    }
  },

  findByUsername: async (username) => {
    const query = "SELECT * FROM users WHERE username = $1";
    try {
      const res = await client.query(query, [username]);
      return res.rows[0];
    } catch (err) {
      console.error("Error finding user by username", err.stack);
      throw err;
    }
  },

  // Thêm các phương thức khác nếu cần
};

module.exports = User;
