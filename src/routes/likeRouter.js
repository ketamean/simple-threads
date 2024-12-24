const express = require('express');
const router = express.Router();

const { get, post, put, del } = require('../controllers/likeController')

router.put('/like', put)

module.exports = router