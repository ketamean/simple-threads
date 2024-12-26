const client = require("../config/database");

// THIS DOES NOT HANDLE ERRORS.
// ERRORS ARE HANDLED BY CONTROLLERS
const threads = {
  async getNLikes(id) {
    console.log('thread models: get n likes')
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = (await client.query(query, values)).rows[0];
    console.log(res.count);
    return res.count;
  },
  async getNComments(id) {
    console.log('thread models: get n comments')
    const query = `
      SELECT count(*)
      FROM Comments
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = (await client.query(query, values)).rows[0];
    console.log(res.count);
    return res.count;
  },
  async checkUserLikedThread(threadId, userId) {
    console.log('check user liked')
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1 AND user_id = $2;
    `;
    const values = [threadId, userId];
    const res = (await client.query(query, values)).rows;
    console.log(res.length);
    if (res.length > 1) throw new Error(`User liked thread ${threadId} more than once`);
    return res.length === 1; // true if liked, false of have not liked yet
  },
  async getThreadOwner(threadId) {
    const query = `
      SELECT u.username AS 'username', u.id AS 'userId', u.profile_picture AS 'avatarImagePath', t.created_at AS 'date', t.content AS 'content'
      FROM Threads t, Users u
      WHERE t.id = $1 AND t.user_id = u.id;
    `;
    const res = (await client.query(query, [threadId])).rows[0];
    if (liked) res.liked = true;
    return res;
  },
  async getThreadById(threadId, viewerId) {
    const nLike = await this.getNLikes(threadId);
    const nComments = await this.getNComments(threadId);
    const liked = await this.checkUserLikedThread(threadId, viewerId);
    const query = `
      SELECT u.username AS 'username', u.id AS 'userId', u.profile_picture AS 'avatarImagePath', t.created_at AS 'date', t.content AS 'content', $2 AS 'nLikes', $3 AS 'nComments'
      FROM Threads t, Users u
      WHERE t.id = $1 AND t.user_id = u.id;
    `;
    const values = [threadId, nLike, nComments];
    const res = (await client.query(query, values)).rows[0];
    if (liked) res.liked = true;
    return res;
  },
};

module.exports = threads;