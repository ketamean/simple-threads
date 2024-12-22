// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel.js");
const sendLink = require("../utils/sendLink.js");
const {hashPassword, comparePassword} = require("../utils/hashPassword.js");
const redis = require("../config/redis.js");
const { md_login, md_signup, md_resetPassword } = require("../metadata.js");
const metadata = require("../metadata.js");

//init redis;
redis.init();

//set jwt-secret
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "no-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "no-secret";
const JWT_LINK_SECRET = process.env.JWT_LINK_SECRET;

const controllers = {};

// Generate JWT Token
const generateAccessToken = (userID) => {
  return jwt.sign({ userID }, JWT_ACCESS_SECRET, {
    expiresIn: "30s",
    algorithm: "HS256",
  });
};

const generateRefresshToken = (userID) => {
  return jwt.sign({ userID }, JWT_REFRESH_SECRET, {
    algorithm: "HS256",
  });
};

// Sign Up Controller
controllers.signUp = async (req, res) => {
  console.log("signUp");
  const { email, password, username } = req.body;
  try {
    // Check if username includes '@'
    if (username.includes('@')) {
      return res.status(400).json({ message: "Username contains numbers and alphabetical letters only" });
    }

    // Check if user exists
    const existingUser = await User.findByUsername(username);
    const existingEmail = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }
    const hashedPassword = await hashPassword(password)
    const newUser = await User.createUser({
      email,
      password: hashedPassword,
      username,
    });

    res.status(201).json({
      message: "User registered successfully",
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
controllers.login = async (req, res) => {
  const { identifier, password } = req.body;
  console.log("Sign In");
  try {
    let user
    if (identifier.includes('@')) user = await User.findByEmail(identifier)
    else user = await User.findByUsername(identifier)
    if (!user) {
      return res.status(401).json({ message: "Incorrect username/password" });
    }
    console.log(password);
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect username/password" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefresshToken(user.id);

    // Store the refresh token in Redis
    console.log(user.id);
    console.log(`Access Token: ${accessToken}, Refresh Token: ${refreshToken}`);

    await redis.storeKey(user.id.toString(), refreshToken);

    //set cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    //send res
    res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      timeExpired: Date.now() + 0.5 * 60 * 1000,
      user: { ...user, password: undefined },
    });
  } catch (error) {
    res.status(500).json({
      message: `Error during login: ${error.message}`,
    });
  }
};

//reset AccessToken

controllers.resetAccessToken = async (req, res, next) => {
  console.log("reset token");
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userID = decoded.userID;

    // Check if the refresh token exists in Redis
    console.log(userID);
    const token = await redis.getKey(userID.toString());
    console.log(token);
    if (!token || token !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Delete the old refresh token from Redis
    await redis.deleteKey(userID.toString());

    // Generate a new refresh token
    const newRefreshToken = generateRefresshToken(userID);

    // Generate a new access token
    const accessToken = generateAccessToken(userID);

    // Store the new refresh token in Redis
    await redis.storeKey(userID.toString(), newRefreshToken);

    // Set the new refresh token as a cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      accessToken,
      timeExpired: Date.now() + 0.5 * 60 * 1000,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

controllers.signOut = async (req, res) => {
  console.log("sigout");
  try {
    // Clear token cookie and delete cookies
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      await redis.deleteKey(decoded.userId.toString());
    }
    res.clearCookie("refreshToken");

    res.redirect(200, "/users/login?message=Logged out successfully");
  } catch (error) {
    res.redirect(500, `/users/login?message=${error}`);
  }
};

controllers.resetPasswordAsk = async (req, res) => {
  console.log("get link reset password");
  const { identifier } = req.body;

  try {
    let user;
    console.log(identifier);
    // Use existing model functions to find user
    if (identifier.includes("@")) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByUsername(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userID = user.id.toString() + "#";
    console.log(`email atfer hash: ${userID}`);

    const resetToken = jwt.sign({ userID: userID }, JWT_LINK_SECRET, {
      expiresIn: "10m",
      algorithm: "HS256",
    });

    //store hashEmail for auth
    await redis.storeKey(userID, resetToken);

    // Send link to email
    console.log(`resset password!!! ${resetToken}`);
    await sendLink(user.email, resetToken);

    return res.status(200).json({
      message: "Link has been sent to your email",
      email: user.email,
      resetToken: resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in password reset request",
      error: error.message,
    });
  }
};

controllers.putResetPasswordSet = async (req, res) => {
  console.log("change password");
  try {
    const key = req.userID.toString() + "#";
    let newPassword =
      typeof req.body.password === "string"
        ? req.body.password
        : String(req.body.password);

    console.log(newPassword);
    console.log(req.userID);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    await User.updatePassword(req.userID, hashedPassword);
    await redis.deleteKey(key);
    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error validating token or resetting password",
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

//get controllers
controllers.getLogin = (req, res) => {
  console.log("get sign in");
  res.locals.css = md_login.css;
  res.render("login", { layout: "layoutWelcome" });
};

controllers.getSignUp = (req, res) => {
  console.log("get sign up");
  res.locals.css = md_signup.css;
  res.render("signup", { layout: "layoutWelcome" });
};

controllers.getresetPasswordAsk = (req, res) => {
  console.log("get reset passsword ask");
  res.locals.css = metadata.md_resetPasswordAsk.css;
  res.render("reset-password-ask", { layout: "layoutWelcome" });
};

controllers.getResetPasswordSet = (req, res) => {
  console.log("get reset passsword set");
  res.locals.css = metadata.md_resetPasswordSet.css;
  res.render("reset-password-set", { layout: "layoutWelcome" });
};

module.exports = controllers;
