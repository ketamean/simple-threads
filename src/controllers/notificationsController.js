const notificationModel = require("../models/notificationModel.js");
const userModel = require("../models/usersModel.js");
const threadsModel = require("../models/threadsModel.js");
const { formatISO } = require("date-fns");
//insert post model

const controllers = {};

controllers.get = async (req, res) => {
  console.log("get notification");
  const userID = req.userID;
  const notificationData = await notificationModel.getNotificationsByUserId(
    userID
  );
  res.locals.metadata = notificationData;
  res.locals.tab_notifications = true;
  res.render("activity", { layout: "layoutNotification" });
};

controllers.post = async (req, res) => {
  try {
    //get user id
    const user = await userModel.findById(req.userID);
    //
    const descriptions = {
      like: "Likes your post",
      comment: "Comments on your post",
      follow: "Follows you",
    };

    //find user interact and post
    const { user_id, type, post_id } = req.body;
    console.log(user_id);

    // use post model to find post
    const post = await threadsModel.getThreadById(post_id);

    //Type of content
    let content, link;

    if (post_id) {
      content = post.content;
      link = "/auth/comments?id=" + post_id;
    } else {
      content = "See profile";
      link = "/auth/profile/" + user.id;
    }
    const notificationData = {
      userId: user_id,
      interactorId: user.id,
      imgInteractor: user.profile_picture,
      nameInteractor: user.username,
      link: link,
      describe: descriptions[type],
      content: content,
      type: type,
      date: formatISO(new Date()),
    };

    const result = await notificationModel.addNotification(notificationData);

    console.log(result);

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

controllers.put = async (req, res) => {
  try {
    console.log("mark as read noti");
    const { id_arr } = req.body;
    console.log(id_arr);

    const result = await notificationModel.markMultipleAsRead(id_arr);
    if (result) {
      res.status(200).json({ message: "Notification marked as read" });
    } else {
      return res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

controllers.del = async (req, res) => {
  try {
    console.log("del noti");
    const { id_arr } = req.body;
    console.log(id_arr);
    const result = await notificationModel.deleteMultipleNotifications(id_arr);
    if (result) {
      res.status(200).json({ message: "Notification deleted" });
    } else {
      return res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = controllers;
