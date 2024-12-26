const data = [
  {
    user_id: 1,
    content: 'omg em yeu anh 1',
    thread_id: 25
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 2',
    thread_id: 25
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 3',
    thread_id: 25
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 4',
    thread_id: 25
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 5',
    thread_id: 25
  },
  {
    user_id: 3,
    content: 'omg em yeu anh 6',
    thread_id: 26
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 7',
    thread_id: 26
  },
]

const add = (client) => {
  data.forEach(async data => {
    const query = `
      INSERT INTO Comments(user_id, content, thread_id)
      VALUES ($1, $2, $3)
      RETURNING id;
    `
    const values = [data.user_id, data.content, data.thread_id]
    await client.query(query, values)
  })
}

module.exports = add