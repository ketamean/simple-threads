const setCookieResponse = (req, res, next) => {
  try {
    // res.cookie()
  } catch (err) {
    res.status(400).json({message: 'Cannot found cookie userId'})
  }
}

module.exports = { setCookieResponse }