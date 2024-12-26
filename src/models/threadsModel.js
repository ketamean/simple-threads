const client = require("../config/database");

// THIS DOES NOT HANDLE ERRORS.
// ERRORS ARE HANDLED BY CONTROLLERS
const threads = {
  getNLikes: async (id) => {
    console.log('thread models: get n likes')
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = await client.query(query, values);
    console.log(res);
    return res
  },
  getNComments: async (id) => {
    console.log('thread models: get n comments')
    const query = `
      SELECT count(*)
      FROM Comments
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = await client.query(query, values);
    console.log(res);
    return res
  },
  checkUserLikedThread: async (threadId, userId) => {
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1 AND user_id = $2;
    `;
    const values = [threadId, userId];
    const res = (await client.query(query, values)).rows;
    if (rows.length > 1) throw new Error(`User liked thread ${threadId} more than once`);
    return rows.length === 1; // true if liked, false of have not liked yet
  },
  getThreadOwner: async (threadId) => {
    const query = `
      SELECT u.username as 'username', u.id as 'userId', u.profile_picture as 'avatarImagePath', t.created_at as 'date', t.content as 'content'
      FROM Threads t, Users u
      WHERE t.id = $1 AND t.user_id = u.id;
    `;
    const res = (await client.query(query, [threadId])).rows[0];
    if (liked) res.liked = true;
    return res;
  },
  getThreadById: async (threadId, viewerId) => {
    const nLike = this.getNLikes(threadId);
    const nComments = this.getNComments(threadId);
    const liked = this.checkUserLikedThread(threadId, viewerId);
    const query = `
      SELECT u.username as 'username', u.id as 'userId', u.profile_picture as 'avatarImagePath', t.created_at as 'date', t.content as 'content', $2 as 'nLikes', $3 as 'nComments'
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