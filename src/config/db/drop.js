const { Client } = require("pg");
const client = new Client({
  connectionString: `postgresql://postgres.yadvzifnfnmphedirnbd:${process.env.POSTGRES_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
});

let query = '';
const tables = ['Likes', 'Comments', 'Follows', 'Notifications', 'ThreadImages', 'Threads', 'Users'];

tables.forEach(table => {
  query += `
    DROP TABLE IF EXISTS ${table};
  `
});

console.log(query);
/*
DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Follows;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS ThreadImages;
DROP TABLE IF EXISTS Threads;
DROP TABLE IF EXISTS Users;
*/
