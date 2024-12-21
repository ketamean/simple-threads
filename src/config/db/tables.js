const tables = {}
tables.Users = `
  CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100),
    bio TEXT,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`
tables.Threads = `
  CREATE TABLE IF NOT EXISTS Threads (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`
tables.Follows = `
  CREATE TABLE IF NOT EXISTS Follows (
    id SERIAL PRIMARY KEY,
    follower_id INT NOT NULL REFERENCES Users(id),
    following_id INT NOT NULL REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT NOW()
  );
`

tables.Likes = `
  CREATE TABLE IF NOT EXISTS Likes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    thread_id INT NOT NULL REFERENCES Threads(id),
    created_at TIMESTAMP DEFAULT NOW()
  );
`

tables.Comments = `
  CREATE TABLE IF NOT EXISTS Comments (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL REFERENCES Threads(id),
    user_id INT NOT NULL REFERENCES Users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`

tables.Notifications = `
  CREATE TABLE IF NOT EXISTS Notifications (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES Users(id),
    type VARCHAR(50) NOT NULL,
    related_id INT NOT NULL REFERENCES Users(id),
    link VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  );
`

tables.ThreadImages = `
  CREATE TABLE IF NOT EXISTS ThreadImages (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL REFERENCES Threads(id),
    image_url VARCHAR(255) NOT NULL
  )
`

let query = ''
Object.keys(tables).forEach(key => query += tables[key])
module.exports = query