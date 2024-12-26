// models/usersModel.js
const client = require("../config/database");

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
    UPDATE users SET alias = '${alias}', bio = '${bio}', profile_picture = '${filePath}' WHERE id = ${userid} RETURNING *
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
    SELECT * FROM followers F, users U WHERE F.follower_id = U.id AND F.following_id = ${userid} ORDER BY F.created_at DESC
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
    SELECT * FROM followers F, users U WHERE F.follower_id = ${userid} AND F.following_id = U.id ORDER BY F.created_at DESC
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
    const currentTime = Date.now() / 1000;
    const query = `
    INSERT INTO followers (follower_id, following_id, created_at) VALUES (${userID}, ${targetID}, to_timestamp(${currentTime})) ON CONFLICT DO NOTHING
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
    DELETE FROM followers WHERE follower_id = ${userID} and following_id = ${targetID}
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
    DELETE FROM follow WHERE follower_id = ${targetID} and following_id = ${userID}
    `;
    try {
      const res = await client.query(query);
    } catch (err) {
      console.error("Error removing follower", err.stack);
    }
  },

  // Add user to UnverifiedUsers
  addUnverifiedUser: async ({ email, password, username }) => {
    const query = `
    INSERT INTO UnverifiedUsers (email, password, username, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;`;
    const values = [email, password, username];
    try {
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error adding unverified user", err.stack);
      throw err;
    }
  },

  findUnverifiedByEmail: async (email) => {
    const query = `
    SELECT * FROM UnverifiedUsers WHERE email = $1;`;
    try {
      const res = await client.query(query, [email]);
      return res.rows[0];
    } catch (err) {
      console.error("Error finding unverified user by email", err.stack);
      throw err;
    }
  },

  // Remove user from UnverifiedUsers
  removeUnverifiedUser: async (email) => {
    const query = `
    DELETE FROM UnverifiedUsers WHERE email = $1
    RETURNING *;`;
    try {
      const res = await client.query(query, [email]);
      return res.rows[0];
    } catch (err) {
      console.error("Error removing unverified user", err.stack);
      throw err;
    }
  },
};

module.exports = user;
