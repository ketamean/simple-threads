const tables = {}
tables.Users = `
  CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    alias VARCHAR(100),
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
tables.Followers = `
  CREATE TABLE IF NOT EXISTS Followers (
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
    user_id INT NOT NULL REFERENCES Users(id),
    img_interactor VARCHAR(255),
    name_interactor VARCHAR(50),
    link VARCHAR(255),
    describe VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    interactor_id INT NOT NULL REFERENCES Users(id)
  );
`

tables.ThreadImages = `
  CREATE TABLE IF NOT EXISTS ThreadImages (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL REFERENCES Threads(id),
    image_url VARCHAR(255) NOT NULL
  );
`

tables.UserTokens = `
  CREATE TABLE IF NOT EXISTS UserTokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    refresh_token TEXT,
    is_expired BOOLEAN DEFAULT FALSE
  );
`

tables.UnverifiedUsers = `
  CREATE TABLE IF NOT EXISTS UnverifiedUsers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    alias VARCHAR(100)
  );
`

let query = ''
Object.keys(tables).forEach(key => query += tables[key])
module.exports = query