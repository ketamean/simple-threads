const controllers = {}
const like = require('../models/likeModels');
const threads = require('../models/threadsModel')
controllers.post = async (req, res) => {
  console.log('like post');
  const userId = req.userID;
  const { threadId } = req.body;
  
  const post = await threads.getThreadById(threadId, userId);
  
  const liked = await like.like(userId, threadId);
  return res.status(200).json( { liked, ownerId: post.userId } );
};

module.exports = controllers;