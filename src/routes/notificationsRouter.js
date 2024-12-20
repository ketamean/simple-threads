const express = require('express');
const router = express.Router();

const { get, post, put, del } = require('../controllers/notificationsController')

module.exports = router;