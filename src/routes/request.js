const express = require("express");

const connectionController = require("../controller/connectionController");

const middelwares = require("../middlewares/auth");

const router = express.Router();

router.post("/request/send/:status/:userId", middelwares.userAuth, connectionController.sendConnectionRequest);

module.exports = router;