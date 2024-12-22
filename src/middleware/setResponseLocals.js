const jwt = require("jsonwebtoken");
const setResponseLocals = (req, res, next) => {
  let token;
  try {
    // check access token's existence
    token = req.headers["authorization"]?.split(" ")[1];
  } catch (err) {
    return res.status(401).redirect('/login');
  }
  try {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(401).redirect('/login');
    })
  } catch (err) {

  }
  next()
}

module.exports = setResponseLocals