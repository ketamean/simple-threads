// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel");
const sendOTP = require("../utils/sendOTP");
const redis = require("../config/redis");

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
    const existingEmail = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      fullname,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { ...newUser, password: undefined },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
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

    const accessToken = generateAccessToken(user.userid);
    const refreshToken = generateRefresshToken(user.userid);

    // Store the refresh token in Redis
    console.log(user.userid);
    console.log(`Access Token: ${accessToken}, Refresh Token: ${refreshToken}`);

    await redis.storeKey(user.userid.toString(), refreshToken);

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
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
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
    await redis.storeKey(user.email, otp.toString());

    // Set OTP token cookie - uses global cookie options
    console.log(`ressetpassword!!! ${otp}`);
    await sendOTP(user.email, otp);

    const tokenOtp = jwt.sign({ email: user.email }, JWT_ACCESS_SECRET, {
      expiresIn: "5m",
      algorithm: "HS256",
    });
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

module.exports = controllers;
