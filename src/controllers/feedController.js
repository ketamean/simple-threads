const controllers = {};
const { md_feed } = require("../metadata");
const Threads = require("../models/threadsModel");
const Users = require("../models/usersModel");
const { formatDistanceToNow } = require("date-fns");

controllers.getFeed = async (req, res) => {
  try {
    const postIDs = await Threads.getAllPosts();
    const finalPosts = await Promise.all(
      postIDs.map(async (postID) => {
        const post = await Threads.getThreadWithoutImageById(postID.id, req.userID);
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

controllers.getFeedFollowing = async (req, res) => {
  try {
    // 1. Get following users
    const following = await Users.getUserFollowing(req.userID);

    // 2. Get posts from followed users
    let allPosts = [];
    for (const user of following) {
      const userPosts = await Threads.getThreadByUserID(user.following_id);
      for (const post of userPosts) {
        const images = await Threads.getThreadImagesById(post.id);
        post.postImagePaths = images ? images.map((img) => img.image_url) : [];
        post.dateDistance = formatDistanceToNow(new Date(post.created_at));
      }
      allPosts = [...allPosts, ...userPosts];
      console.log(allPosts);
    }

    // 3. Sort by date
    allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 4. Set metadata and render
    res.locals.metadata = allPosts;
  } catch (error) {
    console.log(error);
  }
  res.locals.css = md_feed.css;
  res.locals.tab_feed = true;
  res.render("feed");
};

module.exports = controllers;
