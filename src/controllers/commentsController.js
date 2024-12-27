const comments = require('../models/commentsModels');
const threads = require('../models/threadsModel')
const controllers = {}

controllers.getComments = async (req, res) => {
  console.log('get comments');
  try {
    const { id } = req.query;
    const post = await threads.getThreadById(id, req.userID);
    if (!post) throw new Error('Post does not exist');
    post.threadId = id;
    const images = await threads.getThreadImagesById(id);
    post.postImagePaths = images
      ? images.map((image) => image.image_url)
      : [];
    res.locals.post = post;
    console.log(post)
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
    const userId = req.userID;
    console.log('content ', content);
    const post = await threads.getThreadById(threadId, userId);
    if (!post) throw new Error('Post does not exist');
    comments.addComment(req.userID, threadId, content);
    return res.status(201).json({});
  } catch (err) {
    console.log(err);
    return res.status(400).json({message: 'Cannot post your comment. Please try again'})
  }
}

module.exports = controllers