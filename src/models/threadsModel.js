// models/threadsModel.js
const client = require("../config/database");

const thread = {
  createThread: async ({ user_id, content, createdAt }) => {
    const query = `
    INSERT INTO Threads (user_id, content, created_at)
    VALUES ($1, $2, NOW())
    RETURNING *;`;
    const values = [user_id, content, createdAt];
    const res = await client.query(query, values);
    return res.rows[0];
  },
};
