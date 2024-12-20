const express = require('express');
const router = express.Router();

const { get, post, put, del } = require('../controllers/commentsController')

module.exports = router