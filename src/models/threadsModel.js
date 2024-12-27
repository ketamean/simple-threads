const { captureRejectionSymbol } = require("nodemailer/lib/xoauth2");
const client = require("../config/database");
const { formatDistanceToNow } = require("date-fns");

const thread = {
  createThread: async (user_id, content, created_at) => {
    const query = `
    INSERT INTO Threads (user_id, content, created_at)
    VALUES ($1, $2, $3)
    RETURNING *;`;
    const values = [user_id, content, created_at];
    const res = await client.query(query, values);
    return res.rows[0];
  },
  createThreadImage: async (thread_id, image_url) => {
    const query = `
    INSERT INTO ThreadImages (thread_id, image_url)
    VALUES ($1, $2);`;
    const values = [thread_id, image_url];
    await client.query(query, values);
  },
  getThreadIdByUserId: async (user_id) => {
    const query = `
    SELECT id FROM Threads WHERE user_id = $1;`;
    const values = [user_id];
    const res = await client.query(query, values);
    return res.rows;
  },
  getAllPosts: async (limit, offset) => {
    const countQuery = `SELECT COUNT(*) FROM Threads`;
    const totalCount = await client.query(countQuery);

    const query = `
      SELECT id FROM Threads 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    const res = await client.query(query, [limit, offset]);
    return {
      posts: res.rows,
      total: parseInt(totalCount.rows[0].count),
    };
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
    const query = `
      SELECT count(*)
      FROM Comments
      WHERE thread_id = $1;
    `;
    const values = [id];
    const res = (await client.query(query, values)).rows[0];
    return res.count;
  },
  async checkUserLikedThread(threadId, userId) {
    const query = `
      SELECT count(*)
      FROM Likes
      WHERE thread_id = $1 AND user_id = $2;
    `;
    const values = [threadId, userId];
    const res = (await client.query(query, values)).rows;
    if (res.length > 1)
      throw new Error(`User liked thread ${threadId} more than once`);
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
  async getThreadByUserID(userId) {
    const query = `
      SELECT t.*, u.username, u.profile_picture
      FROM Threads t, users u
      WHERE t.user_id = $1 AND t.user_id = u.id
    `;
    const res = (await client.query(query, [userId])).rows;
    for (let i = 0; i < res.length; i++) {
      if (
        res[i].profile_picture === null ||
        res[i].profile_picture === "" ||
        res[i].profile_picture === "undefined" ||
        res[i].profile_picture === undefined ||
        res[i].profile_picture === "null"
      ) {
        res[i].profile_picture = "/img/user-placeholder.jpg";
      } else {
        res[i].profile_picture = res[i].profile_picture.replace("public", "");
      }
      res[i].likes_count = await this.getNLikes(res[i].id);
      res[i].comments_count = await this.getNComments(res[i].id);
      res[i].liked = await this.checkUserLikedThread(res[i].id, userId);
      const postImagePaths = await this.getThreadImagesById(res[i].id);
      res[i].postImagePaths = [];
      for (let j = 0; j < postImagePaths.length; j++) {
        res[i].postImagePaths.push(postImagePaths[j].image_url);
      }
    }
    return res;
  },
};

module.exports = thread;
