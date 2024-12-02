// models/usersModel.js
const client = require("../config/database");

const user = {
  createUser: async ({ email, password, username }) => {
    const query = `
    INSERT INTO Users (email, password, username, fullname, bio, profile_picture, created_at, updated_at)
    VALUES ($1, $2, $3, NULL, NULL, NULL, NOW(), NOW())
    RETURNING *;`;
    const values = [email, password, username];
    console.log(values);
    const res = await client.query(query, values);
    return res.rows[0];
  },
  findById: async (id) => {
    const query = `
    SELECT * FROM Users WHERE id = $1;`;
    const res = await client.query(query, [id]);
    return res.rows[0];
  },
  findByEmail: async (email) => {
    const query = `
    SELECT * FROM Users WHERE email = $1;`;
    const res = await client.query(query, [email]);
    return res.rows[0];
  },
  findByUsername: async (username) => {
    const query = `
    SELECT * FROM Users WHERE username = $1;`;
    const res = await client.query(query, [username]);
    return res.rows[0];
  },

  updatePassword: async (id, newPasswordHash) => {
    const query = `
    UPDATE Users
    SET password= $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;`;
    const values = [newPasswordHash, id];
    const res = await client.query(query, values);
    return res.rows[0];
  },
};

module.exports = user;
