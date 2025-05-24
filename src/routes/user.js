const express = require("express");
const router = express.Router();
const middelwares = require("../middlewares/auth");
const userController = require("../controller/userController");

router.get("/user/requests", middelwares.userAuth, userController.connectionRequests);
router.get("/user/connection", middelwares.userAuth, userController.connectedUsers);



module.exports = router;