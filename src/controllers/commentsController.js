const comments = require('../models/commentsModels');
const threads = require('../models/threadsModel')
const controllers = {}

controllers.getComments = async (req, res) => {
  console.log('get comments');
  try {
    const { id } = req.query;
    const post = await threads.getThreadById(id);
    if (!post) throw new Error('Post does not exist');
    post.threadId = id;
    res.locals.post = post;
    res.locals.comments = await comments.getComments(id);
    res.locals.css = require('../metadata').md_comments.css;
    res.render('post-comments');
  } catch (err) {
    console.log(err);
    return res.status(400).json({message: err.message});
  }
}

controllers.postComments = async (req, res) => {
  console.log('post a comment');
  try {
    const {content, threadId} = req.body;
    const post = await threads.getThreadById(threadId);
    if (!post) throw new Error('Post does not exist');
    comments.addComment(req.userID, threadId, content);
    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(400).json({message: 'Cannot post your comment. Please try again'})
  }
}

module.exports = controllers