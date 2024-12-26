const data = [
  {
    owner_id: 1,
    related_id: 2,
    type: 'comment',
    is_read: true,
    link: 'post/3'
  },
  {
    owner_id: 1,
    related_id: 2,
    type: 'follow',
    is_read: false,
    link: 'profile/2'
  },
  {
    owner_id: 1,
    related_id: 3,
    type: 'follow',
    is_read: false,
    link: 'profile/3'
  },
  {
    owner_id: 1,
    related_id: 4,
    type: 'follow',
    is_read: true,
    link: 'profile/4'
  },
  {
    owner_id: 4,
    related_id: 1,
    type: 'follow',
    is_read: true,
    link: 'profile/1'
  },
  {
    owner_id: 1,
    related_id: 2,
    type: 'like',
    is_read: true,
    link: 'post/3'
  },
  {
    owner_id: 1,
    related_id: 2,
    type: 'like',
    is_read: true,
    link: 'post/4'
  },
]
const add = (client) => {
  data.forEach(async data => {
    const query = `
      INSERT INTO Notifications(owner_id, related_id, type, is_read, link)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `
    const values = [data.owner_id, data.related_id, data.type, data.is_read, data.link]
    await client.query(query, values)
  })
}

module.exports = add