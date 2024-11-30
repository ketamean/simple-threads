// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

const verifyToken = async (req, res, next) => {
  console.log("verify token");
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid token" });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return next(err);
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      req.user.password = null;
      next();
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      // handle  in front end to resset token
      return res.status(401).json({ message: "Token expired" });
    }
    next(error); // Pass the error to the next middleware
  }
};

const verifyOTP = async (req, res, next) => {
  const otp = req.cookies["otp"];
  if (!otp) {
    return res.status(401).json({ message: "No OTP provided" });
  }

  try {
    jwt.verify(otp, process.env.JWT_OTP_SECRET, async (err, otp) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid OTP" });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "OTP expired" });
        }
        return next(err);
      }
      req.otp = otp;
      next();
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "OTP expired" });
    }
    next(error);
  }
};

module.exports = { verifyToken, verifyOTP };
