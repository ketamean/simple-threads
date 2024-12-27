const controllers = {};
const { md_feed } = require("../metadata");
const Threads = require("../models/threadsModel");
const Users = require("../models/usersModel");
const { formatDistanceToNow } = require("date-fns");

const ITEMS_PER_PAGE = 5;

controllers.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const { posts, total } = await Threads.getAllPosts(ITEMS_PER_PAGE, offset);
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const finalPosts = await Promise.all(
      posts.map(async (postID) => {
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
    res.locals.pagination = {
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  } catch (error) {
    console.log(error);
  }
  res.locals.css = md_feed.css;
  res.locals.tab_feed = true;
  res.render("feed");
};

controllers.getFeedFollowing = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // 1. Get following users
    const following = await Users.getUserFollowing(req.userID);

    // 2. Get posts from followed users with complete data
    let allPosts = [];
    for (const user of following) {
      const userPosts = await Threads.getThreadIdByUserId(user.following_id);
      allPosts = [...allPosts, ...userPosts];
    }

    // 3. Sort by date
    allPosts.sort((a, b) => a.id - b.id);

    // 4. Calculate pagination
    const total = allPosts.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // 5. Slice posts for current page
    const paginatedPosts = allPosts.slice(offset, offset + ITEMS_PER_PAGE);

    // 6. Get complete data for each post
    const finalPosts = await Promise.all(
      paginatedPosts.map(async (postID) => {
        const post = await Threads.getThreadWithoutImageById(postID.id);
        const images = await Threads.getThreadImagesById(postID.id);
        post.postImagePaths = images
          ? images.map((image) => image.image_url)
          : [];
        post.dateDistance = formatDistanceToNow(new Date(post.created_at));
        return post;
      })
    );

    // 7. Set response data
    res.locals.metadata = finalPosts;
    res.locals.pagination = {
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  } catch (error) {
    console.log(error);
  }
  res.locals.css = md_feed.css;
  res.locals.tab_feed = true;
  res.render("feed");
};

module.exports = controllers;
