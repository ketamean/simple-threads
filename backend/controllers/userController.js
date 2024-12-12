// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel");
const sendOTP = require("../utils/sendOTP");
const redis = require("../config/redis");
const stringHash = require("string-hash");
const { md_login, md_signup, md_resetPassword } = require("../metadata");

//init redis;
redis.init();

//set jwt-secret
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "no-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "no-secret";

const controllers = {};

// Generate JWT Token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: "30s",
    algorithm: "HS256",
  });
};

const generateRefresshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    algorithm: "HS256",
  });
};

// Sign Up Controller
controllers.signUp = async (req, res) => {
  console.log("signUp");
  const { email, password, username } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findByUsername(username);
    const existingEmail = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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
      aToken: accessToken,
      user: { ...user, password: undefined },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: error.message,
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
    const userId = decoded.userId;

    // Check if the refresh token exists in Redis
    console.log(userId);
    const token = await redis.getKey(userId.toString());
    console.log(token);
    if (!token || token !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Delete the old refresh token from Redis
    await redis.deleteKey(userId.toString());

    // Generate a new refresh token
    const newRefreshToken = generateRefresshToken(userId);

    // Generate a new access token
    const accessToken = generateAccessToken(userId);

    // Store the new refresh token in Redis
    await redis.storeKey(userId.toString(), newRefreshToken);

    // Set the new refresh token as a cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ accessToken });
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

    res.redirect(200, "/users/signIn?message=Logged out successfully");
  } catch (error) {
    res.redirect(500, `/users/signIn?message=${error}`);
  }
};

controllers.resetPasswordRequest = async (req, res) => {
  console.log("get link reset password");
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

    const hashEmail = stringHash(user.email);

    const tokenEmail = jwt.sign({ email: hashEmail }, JWT_ACCESS_SECRET, {
      expiresIn: "10m",
      algorithm: "HS256",
    });

    await redis.storeKey(hashEmail, tokenEmail);

    // Set OTP token cookie - uses global cookie options
    console.log(`ressetpassword!!! ${tokenEmail}`);
    await sendOTP(user.email, tokenEmail);

    return res.status(200).json({
      message: "OTP has been sent to your email",
      email: user.email,
      tokenOtp: tokenOtp,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in password reset request",
      error: error.message,
    });
  }
};

controllers.validateOTPAndResetPassword = async (req, res) => {
  console.log("validateOTPAndResetPassword");
  const { otp, newPassword } = req.body;
  const tokenOtp = req.headers["authorization"]?.split(" ")[1];
  if (!tokenOtp) {
    return res.status(400).json({ message: "OTP token is missing" });
  }

  try {
    const decoded = jwt.verify(tokenOtp, JWT_ACCESS_SECRET);
    const storedOtp = await redis.getKey(decoded.email);
    console.log(decoded.email);
    console.log(storedOtp);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(decoded.userId, hashedPassword);
    await redis.deleteKey(decoded.email);
    //client xóa token
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
controllers.getSignIn = (req, res) => {
  console.log("get sign in");
  res.locals.css = md_login.css;
  res.render("login", { layout: "layoutWelcome" });
};

controllers.getSignUp = (req, res) => {
  console.log("get sign up");
  res.locals.css = md_signup.css;
  res.render("signup", { layout: "layoutWelcome" });
};

controllers.getResetPassword = (req, res) => {
  console.log("get reset passsword");
  res.locals.css = md_resetPassword.css;
  res.render("reset-password-set", { layout: "layoutWelcome" });
};

module.exports = controllers;
