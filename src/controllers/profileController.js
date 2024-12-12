const { Json } = require("sequelize/lib/utils");
const user = require("../models/usersModel");
const usersModel = require("../models/usersModel");
const controller = {}

controller.getProfile = async (req, res) => {
    try {
        const user = await usersModel.findById(req.params.id);
        // const followers = await usersModel.getUserFollowers(req.params.id);
        // const followings = await usersModel.getUserFollowings(req.params.id);
        const followers = [];
        const followings = [];
        if(user.profile_picture === null || user.profile_picture === "") {
            user.profile_picture = "/img/user-placeholder.jpg";
        }
        else if(user.profile_picture.includes("http")) {
            user.profile_picture = user.profile_picture;
        }
        else if(user.profile_picture.includes("static")) {
            user.profile_picture = user.profile_picture.replace("static", "");
        }
        console.log(user);
        res.render("profile", { title: "Profile", user: user, followers: followers, followings: followings });
    } catch (err) {
        console.error("Error getting user profile", err.stack);
        res.status(500).send("Internal server error");
    }
}

controller.updateProfile = async (req, res) => {
    try {
        let{alias, bio} = JSON.parse(JSON.stringify(req.body));
        let avatar = req.file ? req.file.path : "";
        const userID = req.params.id;
        const currentUser = await usersModel.findById(userID);
        if(alias === "") alias = currentUser.alias;
        if(bio === "") bio = currentUser.bio;
        if(avatar === "") avatar = currentUser.avatar;
        const user = await usersModel.updateUserInfo(userID, alias, bio, avatar);
        // const followers = await usersModel.getUserFollowers(userID);
        // const followings = await usersModel.getUserFollowings(userID);
        const followers = [];
        const followings = [];
        res.redirect(`/profile/${userID}`);
    } catch (err) {
        console.error("Error updating user profile", err.stack);
        res.status(500).send("Internal server error");
    }
}

controller.followUser = async (req, res) => {
    try {
        await usersModel.followUser(req.body.user_id, req.body.target_id);
        res.status(200).send("User followed");
    }
    catch (err) {
        console.error("Error following user", err.stack);
        res.status(500).send("Internal server error");
    }
}

controller.unfollowUser = async (req, res) => {
    try {
        await usersModel.unfollowUser(req.body.user_id, req.body.target_id);
        res.status(200).send("User unfollowed");
    }
    catch (err) {
        console.error("Error unfollowing user", err.stack);
        res.status(500).send("Internal server error");
    }
}

module.exports = controller;