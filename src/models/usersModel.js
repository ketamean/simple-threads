// models/usersModel.js
const client = require("../config/database");

const user = {
  createUser: async ({ email, password, username }) => {
    const query = `
    INSERT INTO Users (email, password, username, bio, profile_picture, created_at, updated_at, alias)
    VALUES ($1, $2, $3, NULL, NULL, NOW(), NOW(), NULL)
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
  updateUserInfo: async (userid, username, bio, filePath) => {
    //check username exists
    const checkUsername = `SELECT * FROM users WHERE username = $1 AND id != $2`;
    const resUsername = await client.query(checkUsername, [username, userid]);
    if (resUsername.rows.length > 0) {
      console.log("Username already exists");
      return;
    }
    const query = `
    UPDATE users SET username = $1, bio = $2, profile_picture = $3 WHERE id = $4 RETURNING *
    `;
    try {
      const res = await client.query(query, [username, bio, filePath, userid]);
    } catch (err) {
      console.error("Error updating user info", err.stack);
      throw err;
    }
  },
  // get user's followers
  getUserFollowers: async (userid) => {
    const query = `
    SELECT * FROM followers F, users U WHERE F.follower_id = U.id AND F.following_id = $1 ORDER BY F.created_at DESC
    `;
    try {
      const res = await client.query(query, [userid]);
      return res.rows;
    } catch (err) {
      console.error("Error getting user followers", err.stack);
    }
  },
  // get user's followings
  getUserFollowing: async (userid) => {
    const query = `
    SELECT * FROM followers F, users U WHERE F.follower_id = $1 AND F.following_id = U.id ORDER BY F.created_at DESC
    `;
		try {
			const res = await client.query(query, [userid]);
			return res.rows;
		} catch (err) {
			console.error("Error getting user followings", err.stack);
		}
	},
	// follow user
	followUser: async (userID, targetID) => {
		const currentTime = Date.now() / 1000;
    if (userID === targetID) {
      console.log("Cannot follow yourself");
      return
    }
    const checkExists = `SELECT * FROM followers WHERE follower_id = $1 and following_id = $2`;
    const res = await client.query(checkExists, [userID, targetID]);
    if (res.rows.length > 0) {
      console.log(res.rows);
      return
    }
		const query = `
    INSERT INTO followers (follower_id, following_id, created_at) VALUES ($1, $2, to_timestamp($3)) ON CONFLICT DO NOTHING
    `;
    try {
      const res = await client.query(query, [userID, targetID, currentTime]);
    } catch (err) {
      console.error("Error following user", err.stack);
    }
  },
  // unfollow user
  unfollowUser: async (userID, targetID) => {
    // followerID is the user who wants to unfollow, followeeID is the user who is being unfollowed
    const query = `
    DELETE FROM followers WHERE follower_id = $1 and following_id = $2
    `;
    try {
      const res = await client.query(query, [userID, targetID]);
    } catch (err) {
      console.error("Error unfollowing user", err.stack);
    }
  },

  // check if following user
  checkFollowing: async (userID, targetID) => {
    const query = `
    SELECT * FROM followers WHERE follower_id = $1 and following_id = $2
    `;
    try {
      const res = await client.query(query, [userID, targetID]);
      return res.rows.length > 0;
    } catch (err) {
      console.error("Error checking following", err.stack);
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
