const router = require('express').Router()
const {} = require('../controllers/loginController')
router.get('/', showLoginPage)
module.exports = router