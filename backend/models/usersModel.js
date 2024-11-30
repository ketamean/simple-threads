// models/user.js
const client = require("../config/database");
const { get } = require("../routes");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fullname VARCHAR(100) NOT NULL
  )
`;

client
  .query(createTableQuery)
  .then(() => console.log("Users table created successfully"))
  .catch((err) => console.error("Error creating users table", err.stack));

// Định nghĩa các phương thức cho model User
const User = {
  create: async (userData) => {
    const { username, password, email, fullname } = userData;
    const query = `
      INSERT INTO users (username, password, email, fullname)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [username, password, email, fullname];
    try {
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error creating user", err.stack);
      throw err;
    }
  },

  findById: async (userid) => {
    const query = "SELECT * FROM users WHERE userid = $1";
    try {
      const res = await client.query(query, [userid]);
      return res.rows[0];
    } catch (err) {
      console.error("Error finding user by ID", err.stack);
      throw err;
    }
  },

  findByUsername: async (username) => {
    const query = "SELECT * FROM users WHERE username = $1";
    try {
      const res = await client.query(query, [username]);
      return res.rows[0];
    } catch (err) {
      console.error("Error finding user by username", err.stack);
      throw err;
    }
  },

  //find email
  findByEmail: async (email) => {
    try {
      const res = await client.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  },
  updatePassword: async (userid, newPassword) => {
    const query =
      "UPDATE users SET password = $1 WHERE userid = $2 RETURNING *";
    const values = [newPassword, userid];
    try {
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error updating password", err.stack);
      throw err;
    }
  },
  //update user info
  updateUserInfo: async (userid, alias, bio, filePath) => {
    const query = `
    UPDATE users SET Alias = '${alias}', Bio = '${bio}', Avatar = '${filePath}' WHERE userid = ${userid} RETURNING *
    `
    try {
      const res = await client
      .query(query)
    }
    catch(err){
      console.error("Error updating user info", err.stack);
      throw err;
    }
  },
  //get user's threads
  getUserThreads: async (userid) => {
    const query = `
    SELECT * FROM post WHERE userid = ${userid} and parentid is null and type = 'starter' ORDER BY createdate DESC LIMIT 5
    ` //placeholder, currently with lazy loading, we only need to get the first 5 threads, might need to change this later
    try {
      const res = await client
      .query(query)
      return res.rows;
    }
    catch(err){
      console.error("Error getting user threads", err.stack);
      throw err;
    }
  },
  //get user's replies
  getUserReplies: async (userid) => {
    const query = `
    SELECT rep.*, parent.* FROM post rep, post parent WHERE rep.userid = ${userid} and rep.parentid = parent.postid ORDER BY rep.createdate DESC LIMIT 5
    ` //placeholder, currently with lazy loading, we only need to get the first 5 replies, might need to change this later
    try {
      const res = await client
      .query(query)
      return res.rows;
    }
    catch(err){
      console.error("Error getting user replies", err.stack);
    }
  },
  // get user's followers
  getUserFollowers: async (userid) => {
    const query = `
    SELECT * FROM follow WHERE followeeID = ${userid}
    `
    try {
      const res = await client
      .query(query)
      return res.rows;
    }
    catch(err){
      console.error("Error getting user followers", err.stack);
    }
  },
  // get user's followings
  getUserFollowings: async (userid) => {
    const query = `
    SELECT * FROM follow WHERE followerID = ${userid}
    `
    try {
      const res = await client
      .query(query)
      return res.rows;
    }
    catch(err){
      console.error("Error getting user followings", err.stack);
    }
  },
  // follow user
  followUser: async (userID, targetID) => {
    const currentTime = new Date().toString();
    const query = `
    INSERT INTO follow (followerID, followeeID, date) VALUES (${userID}, ${targetID}, ${currentTime})
    `
    try {
      const res = await client
      .query(query)
    }
    catch(err){
      console.error("Error following user", err.stack);
    }
  },
  // unfollow user
  unfollowUser: async (userID, targetID) => { // followerID is the user who wants to unfollow, followeeID is the user who is being unfollowed
    const query = `
    DELETE FROM follow WHERE followerID = ${userID} and followeeID = ${targetID}
    `
    try {
      const res = await client
      .query(query)
    }
    catch(err){
      console.error("Error unfollowing user", err.stack);
    }
  },
  // get user's followers
  removeFollower: async (userID, targetID) => {
    const query = `
    DELETE FROM follow WHERE followerID = ${targetID} and followeeID = ${userID}
    `
    try {
      const res = await client
      .query(query)
    }
    catch(err){
      console.error("Error removing follower", err.stack);
    }
  },
};

module.exports = User;
