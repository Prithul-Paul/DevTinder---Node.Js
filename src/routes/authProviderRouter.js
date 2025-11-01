const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../utils/passport-google");
const router = express.Router();


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"],
    prompt: "select_account", })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    
    const {user} = req.user;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // console.log(token);
    res.cookie("usertoken", token, {
        expires: new Date(Date.now() + (60000 * 60)), // 1 hour from now
        httpOnly: true,
    });
    
    res.redirect(process.env.FRONTEND_URL);
  }
);


module.exports = router;
