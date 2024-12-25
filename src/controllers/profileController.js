const usersModel = require("../models/usersModel");
const controller = {};

controller.getProfile = async (req, res) => {
	try {
		const user = await usersModel.findById(req.params.id);
		// const userPost = await usersModel.getUserPosts(req.params.id);
		if (user.profile_picture === null || user.profile_picture === "") {
			user.profile_picture = "/img/user-placeholder.jpg";
		} else if (user.profile_picture.includes("http")) {
			user.profile_picture = user.profile_picture;
		} else if (user.profile_picture.includes("static")) {
			user.profile_picture = user.profile_picture.replace("static", "");
		}
		const personal = true;
		const follower = await usersModel.getUserFollowers(req.params.id);
		const following = await usersModel.getUserFollowing(req.params.id);
		if(personal){
			res.render("personal-profile", {
				title: "Profile",
				profileData:{
					user: user,
					personal: personal,
					followerNum: follower.length,
					followingNum: following.length
				}
			});
		}else{
			res.render("other-user-profile", {
				title: "Profile",
				profileData:{
					user: user,
					personal: personal,
					followerNum: follower.length,
					followingNum: following.length
				}
			});
		}
	} catch (err) {
		console.error("Error getting user profile", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.getFollowers = async (req, res) => {
	try {
		const followers = await usersModel.getUserFollowers(req.body.user_id);
		for (let i = 0; i < followers.length; i++) {
			if (
				followers[i].profile_picture === null ||
				followers[i].profile_picture === ""
			) {
				followers[i].profile_picture = "/img/user-placeholder.jpg";
			} else if (followers[user].profile_picture.includes("http")) {
				followers[user].profile_picture =
					followers[user].profile_picture;
			} else if (followers[user].profile_picture.includes("static")) {
				followers[user].profile_picture = followers[
					user
				].profile_picture.replace("static", "");
			}
		}
		res.status(200).json(followers);
	} catch (err) {
		console.error("Error getting user followers", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.getFollowings = async (req, res) => {
	try {
		const followings = await usersModel.getUserFollowing(req.body.user_id);
		for (let i = 0; i < followings.length; i++) {
			if (
				followings[i].profile_picture === null ||
				followings[i].profile_picture === ""
			) {
				followings[i].profile_picture = "/img/user-placeholder.jpg";
			} else if (followings[i].profile_picture.includes("http")) {
				followings[i].profile_picture = followings[i].profile_picture;
			} else if (followings[i].profile_picture.includes("static")) {
				followings[i].profile_picture = followings[
					i
				].profile_picture.replace("static", "");
			}
		}
		res.send(followings);
	} catch (err) {
		console.error("Error getting user followings", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.updateProfile = async (req, res) => {
	try {
		let { alias, bio } = JSON.parse(JSON.stringify(req.body));
		let avatar = req.file ? req.file.path : "";
		const userID = req.params.id;
		const currentUser = await usersModel.findById(userID);
		if (alias === "" || alias === undefined || alias === "undefined")
			alias = currentUser.alias;
		if (bio === "" || bio === undefined || bio === "undefined")
			bio = currentUser.bio;
		if (
			avatar === "" ||
			avatar === undefined ||
			avatar === "undefined" ||
			avatar === null ||
			avatar === "null"
		)
			avatar = currentUser.profile_picture;
		const user = await usersModel.updateUserInfo(
			userID,
			alias,
			bio,
			avatar
		);
		res.redirect(`/profile/${userID}`);
	} catch (err) {
		console.error("Error updating user profile", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.followUser = async (req, res) => {
	try {
		await usersModel.followUser(req.body.user_id, req.body.target_id);
		res.status(200).json("User followed");
	} catch (err) {
		console.error("Error following user", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.unfollowUser = async (req, res) => {
	try {
		await usersModel.unfollowUser(req.body.user_id, req.body.target_id);
		res.status(200).json("User unfollowed");
	} catch (err) {
		console.error("Error unfollowing user", err.stack);
		res.status(500).send("Internal server error");
	}
};

module.exports = controller;
