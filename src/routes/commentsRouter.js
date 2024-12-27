const express = require('express');
const router = express.Router();

const { getComments, postComments } = require('../controllers/commentsController')

router.get('/', getComments);
router.post('/', postComments);

module.exports = router;