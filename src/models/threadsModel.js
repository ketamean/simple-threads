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
  getThreadsPage: async (page) => {
    const query = `
    SELECT id FROM Threads ORDER BY created_at DESC LIMIT 10 OFFSET $1;`;
    const values = [page * 10];
    const res = await client.query(query, values);
    return res.rows;
  },
  getThreadWithoutImageById: async (id) => {
    const query = `
    SELECT 
      t.*,
      u.username,
      u.profile_picture,
      (SELECT COUNT(*) FROM Likes WHERE thread_id = t.id) as likes_count,
      (SELECT COUNT(*) FROM Comments WHERE thread_id = t.id) as comments_count
    FROM Threads t
    JOIN Users u ON t.user_id = u.id
    WHERE t.id = $1;`;
    const res = await client.query(query, [id]);
    return res.rows[0];
  },
  getThreadImageById: async (id) => {
    const query = `
    SELECT * FROM ThreadImages WHERE thread_id = $1;`;
    const res = await client.query(query, [id]);
    return res.rows;
  },
};

module.exports = thread;
