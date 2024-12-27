const express = require('express');
const router = express.Router();

const controllers = require('../controllers/notificationsController')

router.get("/", controllers.get);

router.post("/", controllers.post);

router.put("/", controllers.put);

router.delete("/", controllers.del);


module.exports = router;