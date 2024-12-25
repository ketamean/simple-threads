const controllers = {};

controllers.getCreatePost = (req, res) => {
  console.log("create post controller");
  res.locals.tab_createPost = true;
  res.render("create-post");
};

controllers.post = (req, res) => {};

controllers.put = (req, res) => {};

controllers.del = (req, res) => {};

module.exports = controllers;
