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
  getAllPosts: async () => {
    const query = `
    SELECT id FROM Threads ORDER BY created_at DESC;`;
    const res = await client.query(query);
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
  getThreadImagesById: async (id) => {
    const query = `
    SELECT image_url FROM ThreadImages WHERE thread_id = $1;`;
    const res = await client.query(query, [id]);
    return res.rows;
  },
  getNLikes: async (id) => {
    console.log("thread models: get n likes");
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = await client.query(query, values);
    console.log(res);
    return res;
  },
  getNComments: async (id) => {
    console.log("thread models: get n comments");
    const query = `
      SELECT count(*)
      FROM Comments
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = await client.query(query, values);
    console.log(res);
    return res;
  },
  checkUserLikedThread: async (threadId, userId) => {
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1 AND user_id = $2;
    `;
    const values = [threadId, userId];
    const res = (await client.query(query, values)).rows;
    if (rows.length > 1)
      throw new Error(`User liked thread ${threadId} more than once`);
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

module.exports = thread;
