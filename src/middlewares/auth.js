const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
    // console.log("lml");
        return res.status(401).json({ error: "User Unauthorized" });
    }
    const decriptedUserInfo = jwt.verify(token, 'Prithul@28112000');
    // console.log(decriptedUserInfo);
    const {userId} = decriptedUserInfo;

    const profileDetails = await User.findById(userId);

    if(!profileDetails){
        return res.status(404).json({ error: "User not found" });
    }
    req.user = profileDetails;
    next();
}

module.exports = { 
    userAuth 
};