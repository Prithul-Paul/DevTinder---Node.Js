const User = require("../models/users");
const validations = require("../helpers/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSignUp = async (req, res)=>{
    try{
        validations.signupValidation(req);
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(req.body?.password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User Added Succesfully");
    }catch(err){
        res.status(500).send(err.message);
    }
}

const userLogin = async (req, res)=>{
    const {emailId, password} = req.body;
    try{
        if(!validator.isEmail(emailId)){
            res.status(401).json({error: "Email formate is not correct"});
        }
        const validUserCheck = await User.findOne({emailId:emailId});
        if(!validUserCheck){
            res.status(401).json({error: "Invalid Credential"});
        }else{
            let checkPassword = await bcrypt.compare(password, validUserCheck.password);
            if(!checkPassword){
                res.status(401).json({error: "Invalid Credential"});
            }else{
                const token = jwt.sign({ userId: validUserCheck._id }, 'Prithul@28112000');
                res.cookie("usertoken", token);
                res.send("Login Succesful");
            }
        }
    }catch(err){
        res.send(err.message);
    } 

}

const userProfile = async (req, res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.status(500).send(err.message);
    } 

}


module.exports = { 
    userSignUp,
    userLogin,
    userProfile
};