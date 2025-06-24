const User = require("../models/users");
const validations = require("../helpers/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res)=>{
    try{
        validations.signupValidation(req, res);
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(req.body?.password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        const savedUser = await user.save();


        const token = jwt.sign({ userId: savedUser._id }, 'Prithul@28112000', { expiresIn: '1h' });
        res.cookie("usertoken", token, {
            expires: new Date(Date.now() + (60000 * 60)), // 1 hour from now
            httpOnly: true,
        });

        res.json({
            "status": "success",
            "message": "User signedup successfully!!!",
            "data": savedUser
        });
    }catch(err){
        res.status(500).send("error: "+err);
    }
}

const userLogin = async (req, res)=>{
    const {emailId, password} = req.body;
    try{
        if(!validator.isEmail(emailId)){
            return res.status(401).json({error: "Email formate is not correct"});
        }
        const validUserCheck = await User.findOne({emailId:emailId});
        if(!validUserCheck){
            return res.status(401).json({error: "Invalid Credential"});
        }else{
            let checkPassword = await bcrypt.compare(password, validUserCheck.password);
            if(!checkPassword){
                return res.status(401).json({error: "Invalid Credential"});
            }else{
                const token = jwt.sign({ userId: validUserCheck._id }, 'Prithul@28112000', { expiresIn: '1h' });
                res.cookie("usertoken", token, {
                    expires: new Date(Date.now() + (60000 * 60)), // 1 hour from now
                    httpOnly: true,
                });
                res.send(validUserCheck);
            }
        }
    }catch(err){
        res.send("Error"+ err);
    } 

}

const userLogout = async (req, res)=>{
    // const {emailId, password} = req.body;
    try{
        res.cookie("usertoken", null, {
            expires: new Date(Date.now())
        }).send("Your are logged out!!!");
    }catch(err){
        res.send(err.message);
    } 
}


module.exports = {
    userSignUp,
    userLogin,
    userLogout
};