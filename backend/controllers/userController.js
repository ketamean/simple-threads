// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel");
const sendOTP = require("../middleware/sendOTP");
const { use } = require("../routes");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const controllers = {};

// Generate JWT Token
const generateToken = (userId) => {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

// genrateOTP
const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

// Sign Up Controller
controllers.signUp = async (req, res) => {
	const { fullname, email, password, username } = req.body;

	try {
		// Check if user exists
		const existingUser = await User.findByUsername(username);
		if (existingUser) {
			return res.status(400).json({ message: "Username already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			username,
			password: hashedPassword,
			email,
			fullname,
		});

		const token = generateToken(newUser.userid);

		res.cookie("token", token);
		res.status(201).json({
			message: "User registered successfully",
			token,
			user: { ...newUser, password: undefined },
		});
	} catch (error) {
		res.status(500).json({
			message: "Error registering user",
			error: error.message,
		});
	}
};

// Sign In Controller
controllers.signIn = async (req, res) => {
	const { username, password } = req.body;
	console.log("Sign In");
	try {
		const user = await User.findByUsername(username);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: "Invalid password" });
		}

		const token = generateToken(user.userid);

		res.cookie("token", token);

		res.status(200).json({
			message: "Login successful",
			token,
			user: { ...user, password: undefined },
		});
	} catch (error) {
		res.status(500).json({
			message: "Error during login",
			error: error.message,
		});
	}
};

controllers.signOut = async (req, res) => {
	try {
		// Clear token cookie
		res.clearCookie("token");

		res.status(200).json({
			message: "Logged out successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Error during logout",
			error: error.message,
		});
	}
};

// respassword

controllers.resetPasswordRequest = async (req, res) => {
	const { identifier } = req.body;

	try {
		let user;
		// Use existing model functions to find user
		if (identifier.includes("@")) {
			user = await User.findByEmail(identifier);
		} else {
			user = await User.findByUsername(identifier);
		}

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const otp = generateOTP();
		const tokenOtp = jwt.sign(
			{ userId: user.userid, otp },
			process.env.JWT_SECRET,
			{ expiresIn: "5m" }
		);

		// Set OTP token cookie - uses global cookie options
		res.cookie("tokenOtp", tokenOtp);
		console.log(`ressetpassword!!! ${otp}`);
		await sendOTP(user.email, otp);

		return res.status(200).json({
			message: "OTP has been sent to your email",
			email: user.email,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error in password reset request",
			error: error.message,
		});
	}
};

controllers.validateOTPAndResetPassword = async (req, res) => {
	const { otp, newPassword } = req.body;
	const tokenOtp = req.cookies.tokenOtp;

	if (!tokenOtp) {
		return res.status(400).json({ message: "OTP token is missing" });
	}

	try {
		const decoded = jwt.verify(tokenOtp, JWT_SECRET);
		if (decoded.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await User.updatePassword(decoded.userId, hashedPassword);

		res.clearCookie("tokenOtp");

		return res
			.status(200)
			.json({ message: "Password has been reset successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Error validating OTP or resetting password",
			error: error.message,
		});
	}
};

// update user profile
controllers.updateProfile = async (req, res) => {
	const { name, bio } = req.body;
	name = name.trim();
	bio = bio.trim();
	const userID = req.cookies.userid;
	const file = req.file;
	try {
		const user = await User.findById(userID);
		if (!file) {
			file.path = user.avatar;
		}
		if (file.size > 1024 * 1024 * 25) {
			return res.status(400).json({
				message: "File size too large",
			});
		}
		if (name === "") {
			name = user.alias;
		}
		if (bio === "") {
			bio = user.bio;
		}
		await User.updateUserInfo(userID, name, bio, file.path);
		res.status(200).json({
			message: "Profile updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Error updating profile",
			error: error.message,
		});
	}
	// Get user's starter threads
	controllers.getUserThreads = async (req, res) => {
		const userID = req.cookies.userid;
		try {
			const threads = await User.getUserThreads(userID);
			res.status(200).json({
				message: "User threads retrieved successfully",
				threads,
			});
		} catch (error) {
			res.status(500).json({
				message: "Error retrieving user threads",
				error: error.message,
			});
		}
	};
  // get user's replies
  controllers.getUserReplies = async (req, res) => {
    const userID = req.cookies.userid;
    try {
      const replies = await User.getUserReplies(userID);
      res.status(200).json({
        message: "User replies retrieved successfully",
        replies,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving user replies",
        error: error.message,
      });
    }
  };
  // get user's followers
  controllers.getUserFollowers = async (req, res) => {
    const userID = req.cookies.userid;
    try {
      const followers = await User.getUserFollowers(userID);
      res.status(200).json({
        message: "User followers retrieved successfully",
        followers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving user followers",
        error: error.message,
      });
    }
  };
  // get user's following
  controllers.getUserFollowing = async (req, res) => {
    const userID = req.cookies.userid;
    try {
      const following = await User.getUserFollowing(userID);
      res.status(200).json({
        message: "User following retrieved successfully",
        following,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving user following",
        error: error.message,
      });
    }
  };
  // follow user
  controllers.followUser = async (req, res) => {
    const followerID = req.cookies.userid;
    const followeeID = req.body.followeeID;
    try {
      await User.followUser(followerID, followeeID);
      res.status(200).json({
        message: "User followed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error following user",
        error: error.message,
      });
    }
  };
  // unfollow user
  controllers.unfollowUser = async (req, res) => {
    const followerID = req.cookies.userid;
    const followeeID = req.body.followeeID;
    try {
      await User.unfollowUser(followerID, followeeID);
      res.status(200).json({
        message: "User unfollowed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error unfollowing user",
        error: error.message,
      });
    }
  };
};

module.exports = controllers;
