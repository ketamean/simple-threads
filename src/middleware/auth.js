// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const redis = require("../config/redis");

// for get data from server
const verifyToken = async (req, res, next) => {
  console.log("verify token");
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token);
    if (!token) {
      console.log("No token");
      return res
        .status(401)
        .redirect("/users/login?message=No token provided");
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .redirect("/users/login?message=Token expired");
        }
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .redirect("/users/login?message=Token expired");
        }
        return next(err);
      }

      const user = await User.findById(decoded.userID);
      if (!user) {
        return res.status(401).redirect("/users/login?message=User not found");
      }

      req.user = user;
      req.user.password = null;
      next();
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).redirect("/users/login?message=Token expired");
    }
    if (error.name === "TokenExpiredError") {
      // handle  in front end to resset token
      return res.status(401).redirect("/users/login?message=Token expired");
    }
    return res.status(401).redirect("/users/login?message=Token expired");
  }
};

// for auth to access page
const verifyRefreshToken = async (req, res, next) => {
  console.log("Verify refresh token");
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  if (!refreshToken) {
    return res
      .status(401)
      .redirect("/users/login?message=No refresh token provided");
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return res
              .status(401)
              .redirect("/users/login?message=Invalid Token");
          }
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .redirect("/users/login?message=Token expired");
          }
          return next(err);
        }
        console.log('redis')
        const token = await redis.getKey(decoded.userID.toString());
        console.log('after redis')
        if (!token || token != refreshToken) {
          return res
            .status(401)
            .redirect("/users/login?message=User not found");
        }
        req.userID = decoded.userID;
        next();
      }
    );
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).redirect("/users/login?message=Invalid Token");
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).redirect("/users/login?message=Token expired");
    }
    next(error);
  }
};

const verifyResetToken = async (req, res, next) => {
  console.log("Verify reset token");
  const ressetToken = req.query.resetToken;
  if (!ressetToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    jwt.verify(
      ressetToken,
      process.env.JWT_LINK_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid Token" });
          }
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
          }
          return next(err);
        }
        const storedToken = await redis.getKey(decoded.userID);
        if (storedToken !== ressetToken) {
          return res.status(401).json({ message: "Token not exists" });
        }
        //covert to userid
        req.userID = parseInt(decoded.userID.replace("#", ""), 10);
        next();
      }
    );
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

module.exports = { verifyToken, verifyResetToken, verifyRefreshToken };
