const { Client } = require("pg");
require("dotenv").config({path: '../../.env'});
const client = new Client({
  connectionString: `postgresql://postgres.yadvzifnfnmphedirnbd:${process.env.POSTGRES_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
});
(async () => {
  await client
    .connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Connection error", err.stack));
})();

const addUsers = require('../../seeders/Users')
const addThreads = require('../../seeders/Threads')
const addFollows = require('../../seeders/Follows')
const addComments = require('../../seeders/Comments')
const addLikes = require('../../seeders/Likes')
const addNotifications = require('../../seeders/Notifications');

(async() => {
  await addUsers(client);
  await addThreads(client);
  addFollows(client);
  addComments(client);
  addLikes(client);
  addNotifications(client);
})()
