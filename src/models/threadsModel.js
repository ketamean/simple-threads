const { captureRejectionSymbol } = require("nodemailer/lib/xoauth2");
const client = require("../config/database");
const { formatDistanceToNow } = require("date-fns");

// THIS DOES NOT HANDLE ERRORS.
// ERRORS ARE HANDLED BY CONTROLLERS
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
  async getThreadById(threadId, viewerId) {
    const nLike = await this.getNLikes(threadId);
    const nComments = await this.getNComments(threadId);
    const query = `
      SELECT u.username AS "username", u.id AS "userId", u.profile_picture AS "profile_picture", t.created_at AS "createdAt", t.content AS "content", $2 AS "likes_count", $3 AS "comments_count"
      FROM Threads t, Users u
      WHERE t.id = $1 AND t.user_id = u.id;
    `;
    const values = [threadId, nLike, nComments];
    let res = (await client.query(query, values)).rows;
    if (res.length === 0) return [];
    res = res[0];
    res.dateDistance = formatDistanceToNow(res.createdAt);

    const liked = await this.checkUserLikedThread(threadId, viewerId);
    if (liked) res.liked = true;
    return res;
  },
};

module.exports = thread;