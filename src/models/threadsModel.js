const client = require('../config/initDatabase');
const Comments = require('./commentsModel')

const Thread = {
  Comments,
  getThreadsFromFollowing: async (actorId, offset = null, limit = null) => {
    let valId = 2
    let query = `
      SELECT *, count_comments_of_one_post(t.id) as nComments, count_likes_of_one_post(t.id) as nLikes
      FROM Threads t JOIN Followers f ON t.user_id = f.following_id AND f.follower_id = $1, ThreadImages i
      WHERE t.id = i.thread_id
      GROUP BY t.*;
    `
    const values = [actorId];
    if (limit) {
      query += `
        LIMIT \$${valId}
      `
      values.push(limit);
      valId++;
    }
    if (offset) {
      query += `
        OFFSET \$${valId}
      `
      values.push(offset);
    }
    let res = await client.query(query, values)
    if (res) res = res.rows
    return []
  },

  getThreads: async (actorId, offset = null, limit = null) => {
    let valId = 2
    let query = `
      SELECT *, count_comments_of_one_post(t.id) as nComments, count_likes_of_one_post(t.id) as nLikes
      FROM Threads t, ThreadImages i
      WHERE t.id = i.thread_id
      GROUP BY t.*;
    `
    const values = [actorId];
    if (limit) {
      query += `
        LIMIT \$${valId}
      `
      values.push(limit);
      valId++;
    }
    if (offset) {
      query += `
        OFFSET \$${valId}
      `
      values.push(offset);
    }
    let res = await client.query(query, values)
    if (res) return res.rows
    return []
  },

  likeThread: async (actorId, threadId) => {

  },

  unlikeThread: async (actorId, threadId) => {
    
  },

  addOneThread: async (actorId, content, imageUrls = []) => {
    const query = `
      INSERT INTO Threads(user_id, content)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [actorId, content]
    let res = await client.query(query, values)
    if (res) res = res.rows
    if (res) res = res[0]
    else return {}

    if (imageUrls) {
      let query = `
        INSERT INTO ThreadImages(thread_id, image_url) VALUES
      `
      for (let i = 0; i < imageUrls.length; i++) {
        if (i !== 0) query += ','
        query += `($1, \$${i + 2})`
      }
      const values = [res.id, ...imageUrls]
      await client.query(query, values)
    }
    return res
  }
}

module.exports = Thread;