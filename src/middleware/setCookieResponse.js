const jwt = require("jsonwebtoken");

const setCookieResponse = (req, res, next) => {
  try {
    res.locals.userId = req.user.id;
    next();
  } catch (err) {
    res.errorMessage = 'You have lost your authentication'
    return res.redirect('/users/login');
  }
}

module.exports = { setCookieResponse }