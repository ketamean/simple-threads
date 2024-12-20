const express = require('express');
const router = express.Router();

const { get, post, put, del } = require('../controllers/createPostController')

module.exports = router