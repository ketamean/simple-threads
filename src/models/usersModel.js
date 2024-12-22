// models/usersModel.js
const client = require("../config/initDatabase");

const user = {
  createUser: async ({ email, password, username }) => {
    const query = `
    INSERT INTO Users (email, password, username, fullname, bio, profile_picture, created_at, updated_at, alias)
    VALUES ($1, $2, $3, NULL, NULL, NULL, NOW(), NOW(), NULL)
    RETURNING *;`;
    const values = [email, password, username];
    console.log(values);
    const res = await client.query(query, values);
    return res.rows[0];
  },
  findById: async (id) => {
    const query = `
    SELECT * FROM Users WHERE id = $1;`;
    const res = await client.query(query, [id]);
    return res.rows[0];
  },
  findByEmail: async (email) => {
    const query = `
    SELECT * FROM Users WHERE email = $1;`;
    const res = await client.query(query, [email]);
    return res.rows[0];
  },
  findByUsername: async (username) => {
    const query = `
    SELECT * FROM Users WHERE username = $1;`;
    const res = await client.query(query, [username]);
    return res.rows[0];
  },

  updatePassword: async (id, newPasswordHash) => {
    const query = `
    UPDATE Users
    SET password= $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;`;
    const values = [newPasswordHash, id];
    const res = await client.query(query, values);
    return res.rows[0];
  },
  //update user info
  updateUserInfo: async (userid, alias, bio, filePath) => {
    const query = `
    UPDATE users SET alias = '${alias}', bio = '${bio}', avatar = '${filePath}' WHERE userid = ${userid} RETURNING *
    `;
    try {
      const res = await client.query(query);
    } catch (err) {
      console.error("Error updating user info", err.stack);
      throw err;
    }
  },
  // get user's followers
  getUserFollowers: async (userid) => {
    const query = `
    SELECT * FROM followers WHERE followed_id = ${userid}
    `;
    try {
      const res = await client.query(query);
      return res.rows;
    } catch (err) {
      console.error("Error getting user followers", err.stack);
    }
  },
  // get user's followings
  getUserFollowing: async (userid) => {
    const query = `
    SELECT * FROM follow WHERE follower_id = ${userid}
    `;
    try {
      const res = await client.query(query);
      return res.rows;
    } catch (err) {
      console.error("Error getting user followings", err.stack);
    }
  },
  // follow user
  followUser: async (userID, targetID) => {
    const currentTime = new Date().toString();
    const query = `
    INSERT INTO followers (follower_id, followed_id, created_at) VALUES (${userID}, ${targetID}, ${currentTime})
    `;
    try {
      const res = await client.query(query);
    } catch (err) {
      console.error("Error following user", err.stack);
    }
  },
  // unfollow user
  unfollowUser: async (userID, targetID) => {
    // followerID is the user who wants to unfollow, followeeID is the user who is being unfollowed
    const query = `
    DELETE FROM follow WHERE follower_id = ${userID} and followed_id = ${targetID}
    `;
    try {
      const res = await client.query(query);
    } catch (err) {
      console.error("Error unfollowing user", err.stack);
    }
  },
  // get user's followers
  removeFollower: async (userID, targetID) => {
    const query = `
    DELETE FROM follow WHERE follower_id = ${targetID} and followed_id = ${userID}
    `;
    try {
      const res = await client.query(query);
    } catch (err) {
      console.error("Error removing follower", err.stack);
    }
  },
};

module.exports = user;
