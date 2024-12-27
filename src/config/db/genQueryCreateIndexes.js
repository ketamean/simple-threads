const indexes = {}
indexes.Comments_threadId = `
  CREATE INDEX IF NOT EXISTS Comments_threadId ON "public"."comments" USING btree ("thread_id");
`

indexes.Followers_followerId = `
  CREATE INDEX IF NOT EXISTS Follows_followerId ON "public"."followers" USING btree ("follower_id");
`

indexes.Followers_followingId = `
  CREATE INDEX IF NOT EXISTS Follows_followingId ON "public"."followers" USING btree ("following_id");
`

indexes.Notifications_userId = `
  CREATE INDEX IF NOT EXISTS Notifications_userId ON "public"."notifications" USING btree ("user_id");
`

indexes.ThreadImages_threadId = `
  CREATE INDEX IF NOT EXISTS ThreadImages_threadId ON "public"."threadimages" USING btree ("thread_id");
`

indexes.Threads_userId = `
  CREATE INDEX IF NOT EXISTS Threads_userId ON "public"."threads" USING btree ("user_id");
`

// indexes.Users_email = `
//   CREATE INDEX IF NOT EXISTS Users_email ON "public"."users" USING btree ("email");
// `

// indexes.Users_username = `
//   CREATE INDEX IF NOT EXISTS Users_username ON "public"."users" USING btree ("username");
// `

let query = ''
Object.keys(indexes).forEach(key => query += indexes[key])
module.exports = query