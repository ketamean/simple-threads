const data = [
  {
    user_id: 1,
    thread_id: 27,
  },
  {
    user_id: 1,
    thread_id: 29
  },
  {
    user_id: 1,
    thread_id: 30,
  },
  {
    user_id: 1,
    thread_id: 26,
  },
  {
    user_id: 1,
    thread_id: 31,
  },
  {
    user_id: 2,
    thread_id: 26,
  },
  {
    user_id: 3,
    thread_id: 26,
  },
  {
    user_id: 4,
    thread_id: 26,
  },
  {
    user_id: 4,
    thread_id: 27,
  },
  {
    user_id: 5,
    thread_id: 27,
  },
  {
    user_id: 6,
    thread_id: 27,
  },
]

const add = (client) => {
  data.forEach(async data => {
    const query = `
      INSERT INTO Likes(user_id, thread_id)
      VALUES ($1, $2)
      RETURNING id;
    `
    const values = [data.user_id, data.thread_id]
    await client.query(query, values)
  })
}

module.exports = add