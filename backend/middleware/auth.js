// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const redis = require("../config/redis");

const verifyToken = async (req, res, next) => {
  console.log("verify token");
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token);
    if (!token) {
      console.log("No token");
      return res
        .status(401)
        .redirect("/users/signIn?message=No token provided");
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .redirect("/users/signIn?message=Token expired");
        }
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .redirect("/users/signIn?message=Token expired");
        }
        return next(err);
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).redirect("/users/signIn?message=User not found");
      }

      req.user = user;
      req.user.password = null;
      next();
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).redirect("/users/signIn?message=Token expired");
    }
    if (error.name === "TokenExpiredError") {
      // handle  in front end to resset token
      return res.status(401).redirect("/users/signIn?message=Token expired");
    }
    return res.status(401).redirect("/users/signIn?message=Token expired");
  }
};

const verifyResetToken = async (req, res, next) => {
  console.log("Verify reset token");
  const ressetToken = req.query.resetToken;
  console.log(ressetToken);
  if (!ressetToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    jwt.verify(ressetToken, process.env.JWT_LINK_SECRET, async (err, data) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "Invalid Token" });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return next(err);
      }
      const storedToken = await redis.getKey(data.userID);
      if (storedToken !== ressetToken) {
        return res.status(401).json({ message: "Token not exists" });
      }
      //covert to userid
      req.userID = parseInt(data.userID.replace("#", ""), 10);
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

module.exports = { verifyToken, verifyResetToken };
