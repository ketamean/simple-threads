const controllers = {};

controllers.getCreatePost = (req, res) => {
  console.log("create post controller");
  res.locals.tab_createPost = true;
  res.render("create-post");
};

controllers.createPost = (req, res) => {
  const { content, createdAt } = req.body;
  const userID = req.userID;
  console.log(content, userID, createdAt);
};

controllers.put = (req, res) => {};

controllers.del = (req, res) => {};

module.exports = controllers;
