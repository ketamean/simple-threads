const data = [
  {
    user_id: 1,
    content: 'omg em yeu anh 1',
  },
  {
    user_id: 2,
    content: 'omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh omg em yeu anh',
    imageUrls: ['/1.png', '/2.png', '/3.png', '/4.png']
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 2',
    imageUrls: ['/1.png', '/2.png', '/3.png', '/4.png']
  },
  {
    user_id: 1,
    content: 'omg em yeu anh 3',
  },
  {
    user_id: 3,
    content: 'omg em yeu anh 4',
  },
  {
    user_id: 5,
    content: 'omg em yeu anh 5',
  },
  {
    user_id: 4,
    content: 'omg em yeu anh 6',
  },
]

const add = async (client) => {
  data.forEach(async data => {
    const query = `
      INSERT INTO Threads(user_id, content)
      VALUES ($1, $2)
      RETURNING id;
    `
    const values = [data.user_id, data.content]
    const id = (await client.query(query, values)).rows[0].id
    if (data.imageUrls) {
      data.imageUrls.forEach(async url => {
        const query = `
          INSERT INTO ThreadImages(thread_id, image_url)
          VALUES ($1, $2);
        `
        const values = [id, url]
        await client.query(query, values)
      })

    }
  })
}

module.exports = add