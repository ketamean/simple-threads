const data = [
  {
    follower_id: 1,
    following_id: 2,
  },
  {
    follower_id: 1,
    following_id: 3,
  },
  {
    follower_id: 1,
    following_id: 4,
  },
  {
    follower_id: 2,
    following_id: 1,
  },
  {
    follower_id: 3,
    following_id: 1,
  },
  {
    follower_id: 2,
    following_id: 3,
  }
]

const add = (client) => {
  data.forEach(async data => {
    const query = `
      INSERT INTO Follows(follower_id, following_id)
      VALUES ($1, $2)
      RETURNING id;
    `
    const values = [data.follower_id, data.following_id]
    await client.query(query, values)
  })
}

module.exports = add