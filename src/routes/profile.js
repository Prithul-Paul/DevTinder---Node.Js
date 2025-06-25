const express = require("express");
const profileController = require("../controller/profileController");
const middelwares = require("../middlewares/auth");

const router = express.Router();

router.get("/profile/view", middelwares.userAuth, profileController.userProfile);
router.patch("/profile/edit/", middelwares.userAuth, profileController.userProfileEdit);
router.patch("/profile/forget-password/", profileController.frogotPassword);

module.exports = router;