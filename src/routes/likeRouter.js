const express = require('express');
const router = express.Router();

const { post } = require('../controllers/likeController');

router.post('/', post);

module.exports = router;