const express = require("express");
const router = express.Router();

const feedRouter = require("./feedRouter");
const profileRouter = require("./profileRouter");
const likeRouter = require("./likeRouter");
const commentsRouter = require("./commentsRouter");
const createPostRouter = require("./createPostRouter");
const notificationsRouter = require("./notificationsRouter");

const setLocalsUserId = require('../middleware/setLocalsUserId');

router.use(setLocalsUserId);

router.get('/', (req, res) => {
  return res.redirect('/auth/feed')
});

router.use('/feed', feedRouter);
router.use('/like', likeRouter);
router.use('/comments', commentsRouter);
router.use('/create-post', createPostRouter);
router.use('/notifications', notificationsRouter);
router.use('/profile', profileRouter);

module.exports = router;