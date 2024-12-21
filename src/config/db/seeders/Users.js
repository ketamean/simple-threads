const { hashPassword } = require('../../../utils/hashPassword')
const data = [
  {
    email: 'chiemthoica@gmail.com',
    username: 'admin',
    password: 'Admin123@!',
    bio: 'tao la ong noi may day',
    profile_picture: '/img/default.png'
  },
  {
    email: 'tttoan22@clc.fitus.edu.vn',
    username: 'ketamean',
    password: 'K3t4m34n!',
    bio: 'tao van la ong noi may day',
    profile_picture: '/img/default.png'
  },
  {
    email: 'instance1@gmail.com',
    username: 'instance1',
    password: '!Instance1',
    bio: 'Day la instance1',
    profile_picture: '/img/default.png'
  },
  {
    email: 'instance2@gmail.com',
    username: 'instance2',
    password: '!Instance2',
    bio: 'Day la instance2',
    profile_picture: '/img/default.png'
  },
  {
    email: 'instance3@gmail.com',
    username: 'instance3',
    password: '!Instance3',
    bio: 'Day la instance3',
    profile_picture: '/img/default.png'
  },
  {
    email: 'instance4@gmail.com',
    username: 'instance4',
    password: '!Instance4',
    bio: 'Day la instance4',
    profile_picture: '/img/default.png'
  }
]

const add = async (client) => {
  data.forEach(async data => {
    const query = `
      INSERT INTO Users(email, username, password, bio)
      VALUES ($1, $2, $3, $4);
    `
    const psw = await hashPassword(data.password)
    const values = [data.email, data.username, psw, data.bio]
    await client.query(query, values)
  })
}

module.exports = add