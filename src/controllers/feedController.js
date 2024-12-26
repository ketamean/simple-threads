const controllers = {};
const { md_feed } = require("../metadata");
const metadata = require("../metadata.js");
const Threads = require("../models/threadsModel");
const { formatDistanceToNow } = require("date-fns");

controllers.getFeed = async (req, res) => {
  try {
    const postIDs = await Threads.getAllPosts();
    const finalPosts = await Promise.all(
      postIDs.map(async (postID) => {
        const post = await Threads.getThreadWithoutImageById(postID.id);
        const images = await Threads.getThreadImagesById(postID.id);
        post.postImagePaths = images
          ? images.map((image) => image.image_url)
          : [];
        post.dateDistance = formatDistanceToNow(new Date(post.created_at));
        return post;
      })
    );
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
