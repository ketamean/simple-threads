const client = require("../config/database");

const like = {
  async hasAlreadyLiked(viewerId, threadId) {
    const query = `
      SELECT *
      FROM Likes
      WHERE user_id = $1 AND thread_id = $2;
    `
    const values = [viewerId, threadId];
    const res = (await client.query(query, values)).rows;
    console.log('hasAlreadyLiked ', viewerId, ' ', threadId,' ', res);
    return res.length != 0;
  },
  async removeLike(userId, threadId) {
    const query = `
      DELETE FROM Likes WHERE user_id = $1 AND thread_id = $2 RETURNING *;
    `;
    const values = [userId, threadId];
    return (await client.query(query, values)).rows[0];
  },
  async addLike(userId, threadId) {
    const query = `
      INSERT INTO Likes (user_id, thread_id) VALUES ($1, $2) RETURNING *;
    `;
    const values = [userId, threadId];
    return (await client.query(query, values)).rows[0];
  },
  async like(userId, threadId) {
    const liked = await this.hasAlreadyLiked(userId, threadId);
    console.log('liked ', liked);
    if (liked) {
      await this.removeLike(userId, threadId);
      return false;
    } else {
      await this.addLike(userId, threadId);
      return true;
    }
  }
};

module.exports = like;