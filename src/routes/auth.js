const express = require("express");
const userController = require("../controller/authController");

const router = express.Router();

router.post("/signup", userController.userSignUp);
router.post("/login", userController.userLogin);
router.get("/logout", userController.userLogout);

module.exports = router;