const client = require("../config/database");
const { formatDistanceToNow } = require("date-fns");

const comments = {
  async getComments(threadId) {
    console.log('models: get comments')
    const query = `
      SELECT c.user_id as "userId", c.content, u.profile_picture as "avatarImagePath", u.username, c.created_at
      FROM Comments c, Users u
      WHERE c.user_id = u.id AND c.thread_id = $1
      ORDER BY c.created_at DESC;
    `;
    const values = [threadId];
    const res = (await client.query(query, values)).rows;
    res.forEach((row) => {
      row.date = formatDistanceToNow(row.created_at);
    });
    console.log(res);
    return res;
  },

  async addComment(userid, threadid, content) {
    const query = `
      INSERT INTO Comments(user_id, thread_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `
    const values = [userid, threadid, content];
    return (await client.query(query, values)).rows[0];
  }
}

module.exports = comments;