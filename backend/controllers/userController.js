// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const controllers = {};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
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

    const token = generateToken(user.userid);

    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { ...user, password: undefined },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
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

module.exports = controllers;
