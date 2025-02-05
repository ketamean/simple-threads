const usersModel = require("../models/usersModel");
const threadsModel = require("../models/threadsModel");
const createClient = require("@supabase/supabase-js").createClient;
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const decode = require("base64-arraybuffer").decode;
const controller = {};

controller.getProfile = async (req, res) => {
	try {
		const tokenID = req.userID;
		const user = await usersModel.findById(req.params.id);
		const userPosts = await threadsModel.getThreadByUserID(req.params.id);
		console.log(userPosts);
		if (
			user.profile_picture === null ||
			user.profile_picture === "" ||
			user.profile_picture === "undefined" ||
			user.profile_picture === undefined ||
			user.profile_picture === "null"
		) {
			user.profile_picture = "/img/user-placeholder.jpg";
		} else if (user.profile_picture.includes("http")) {
			user.profile_picture = user.profile_picture;
		} else if (user.profile_picture.includes("public")) {
			user.profile_picture = user.profile_picture.replace("public", "");
		}
		const personal = parseInt(tokenID) === parseInt(req.params.id);
		const follower = await usersModel.getUserFollowers(req.params.id);
		const following = await usersModel.getUserFollowing(req.params.id);
		if (personal) {
			res.render("personal-profile", {
				title: "Profile",
				profileData: {
					user: user,
					personal: personal,
					followerNum: follower.length,
					followingNum: following.length,
					posts: userPosts,
					tokenID: tokenID,
				},
			});
		} else {
			const isFollowing = await usersModel.checkFollowing(
				tokenID,
				req.params.id
			);
			res.render("other-user-profile", {
				title: "Profile",
				profileData: {
					user: user,
					personal: personal,
					followerNum: follower.length,
					followingNum: following.length,
					posts: userPosts,
					isFollowing: isFollowing,
					tokenID: tokenID,
				},
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
				followers[i].profile_picture === "" ||
				followers[i].profile_picture === "undefined" ||
				followers[i].profile_picture === undefined ||
				followers[i].profile_picture === "null"
			) {
				followers[i].profile_picture = "/img/user-placeholder.jpg";
			} else if (followers[i].profile_picture.includes("http")) {
				followers[i].profile_picture = followers[i].profile_picture;
			} else if (followers[i].profile_picture.includes("public")) {
				followers[i].profile_picture = followers[i].profile_picture.replace("public", "");
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
				followings[i].profile_picture === "" ||
				followings[i].profile_picture === "undefined" ||
				followings[i].profile_picture === undefined ||
				followings[i].profile_picture === "null"
			) {
				followings[i].profile_picture = "/img/user-placeholder.jpg";
			} else if (followings[i].profile_picture.includes("http")) {
				followings[i].profile_picture = followings[i].profile_picture;
			} else if (followings[i].profile_picture.includes("public")) {
				followings[i].profile_picture = followings[
					i
				].profile_picture.replace("public", "");
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
		let { username, bio } = JSON.parse(req.body.user);
		let avatar = req.file ? req.file.path : "";
		const file = req.file;
		if (file) {
			const buffer = decode(file.buffer.toString("base64"));
			file.originalname =
				file.originalname.split(".")[0] +
				"-" +
				Date.now() +
				"." +
				file.originalname.split(".")[1];
			const { data, error } = await supabase.storage
				.from("image_storage")
				.upload(file.originalname, buffer);
			if (error) {
				console.error("Error uploading image", error);
				res.status(500).send("Internal server error");
			}
			const publicURL = await supabase.storage
				.from("image_storage")
				.getPublicUrl(data.path);
			avatar = publicURL.data.publicUrl;
		}
		const userID = req.params.id;
		const currentUser = await usersModel.findById(userID);
		if (
			username === "" ||
			username === undefined ||
			username === "undefined"
		)
			username = currentUser.username;
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
			username,
			bio,
			avatar
		);
		res.status(200).json({
			message: "OK",
		});
	} catch (err) {
		console.error("Error updating user profile", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.followUser = async (req, res) => {
	try {
		console.log(req.body);
		await usersModel.followUser(req.body.user_id, req.body.target_id);
		res.status(200).json("User followed");
	} catch (err) {
		console.error("Error following user", err.stack);
		res.status(500).send("Internal server error");
	}
};

controller.unfollowUser = async (req, res) => {
	try {
		console.log(req.body);
		await usersModel.unfollowUser(req.body.user_id, req.body.target_id);
		res.status(200).json("User unfollowed");
	} catch (err) {
		console.error("Error unfollowing user", err.stack);
		res.status(500).send("Internal server error");
	}
};

module.exports = controller;
