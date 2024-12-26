const controllers = {};
const { md_feed } = require("../metadata");
const metadata = require("../metadata.js");
const Threads = require("../models/threadsModel");
const { formatDistanceToNow } = require("date-fns");

controllers.getFeed = async (req, res) => {
  try {
    const { page } = req.query;
    const postIDs = await Threads.getThreadsPage(0);
    console.log(postIDs);
    const finalPosts = await Promise.all(
      postIDs.map(async (postID) => {
        const post = await Threads.getThreadWithoutImageById(postID.id);
        post.dateDistance = formatDistanceToNow(new Date(post.created_at));
        return post;
      })
    );
    console.log(finalPosts);
    res.locals.metadata = finalPosts;
  } catch (error) {
    console.log(error);
  }
  res.locals.css = md_feed.css;
  res.locals.tab_feed = true;
  res.render("feed");
};

controllers.createFeed = (req, res) => {
  res.locals.username = "vinhpham";
  res.locals.css = metadata.md_createPost.css || [];
  res.locals.tab_createPost = true;
  res.render("create-post");
};

module.exports = controllers;
