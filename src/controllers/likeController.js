const controllers = {}
const like = require('../models/likeModels');
controllers.post = async (req, res) => {
  console.log('like post');
  const userId = req.userID;
  const { threadId } = req.body;
  const liked = await like.like(userId, threadId);
  return res.status(200).json( { liked } );
};

module.exports = controllers;