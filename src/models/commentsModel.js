const client = require("../config/initDatabase");
// NOTE: these following methods possibly raise errors
const Comments = {
  addOneComment: async (threadId, userId, content) => {
    const query = `
      INSERT INTO Comments(thread_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `
    const values = [threadId, userId, content];
    return (await client.query(query, values)).rows[0]
  },

  getAllComments: async (threadId) => {
    const query = `
      SELECT *
      FROM Comments
      WHERE thread_id = $1;
    `
    const values = [threadId]
    let res = await client.query(query, values)
    if (res) return res.rows
    return []
  }
}

module.exports = Comments