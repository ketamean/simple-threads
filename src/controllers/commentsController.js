const comments = require('../models/commentsModels');
const threads = require('../models/threadsModel')
const controllers = {}

controllers.getComments = async (req, res) => {
  const { id } = req.query;
  try {
    res.locals.comments = await comments.getComments(id);
    res.locals.post = threads.getThreadById(threadId)
    res.render('post-comments');
  } catch (err) {
    console.log(err);
    return res.status(500).redirect('/auth/feed');
  }
}

controllers.postComments = (req, res) => {
  
}

module.exports = controllers