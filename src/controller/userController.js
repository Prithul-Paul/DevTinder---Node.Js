const User = require("../models/users");
const validator = require("validator");
const validations = require("../helpers/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const userSignUp = async (req, res)=>{
    // console.log(req.body);
    // const allowedFields = ["firstName", "lastName", "emailId", "password", "gender"];
    try{
        validations.signupValidation(req);
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(req.body?.password, 10);
        // const fieldCheck = Object.keys(req.body).every((key) => allowedFields.includes(key));
        // if(!fieldCheck){
        //     throw new Error("Trying Insert Enexpected Fields");
        // }
        // if(!validator.isEmail(req.body?.emailId)){
        //     throw new Error("Invalid Email");
        // }
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User Added Succesfully");
    }catch(err){
        res.status(500).send(err);
    }
}

const userLogin = async (req, res)=>{
    const {emailId, password} = req.body;
    try{
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Email Format");
        }
        const validUserCheck = await User.findOne({emailId:emailId});
        if(!validUserCheck){
            throw new Error("Invalid Credetials");
        }else{
            let checkPassword = await bcrypt.compare(password, validUserCheck.password);
            if(!checkPassword){
                throw new Error("Invalid Credetials");
            }else{
                let token = jwt.sign({ userId: validUserCheck._id }, 'Ptithul@28112000');
                //console.log(token);
                res.cookie("token", token);
                res.send("Login Succesful");
            }
        }
    }catch(err){
        res.status(500).send(err);
    } 

}

const userprofile = async (req, res)=>{
    // const {emailId, password} = req.body;
    try{
        const cookie = req.cookies;
        const { token } = cookie;
        if(!token){
           throw new Error("Un-authorized User");
        }
        const decodedInfo = jwt.verify(token, 'Ptithul@28112000');
        const {userId} = decodedInfo;
        const resUser = await User.findById(userId); 
        res.send(resUser);
        // console.log(decodedInfo);
    }catch(err){
        res.status(500).send(err);
    } 

}

const findUserByEmail = async (req, res)=> {
    try{
        const userEmail = req.body.emailId;
        const resUser = await User.find({emailId: userEmail});
        if(resUser.length !== 0){
            res.send(resUser);
        }else{
            res.status(400).send("User not found");
        }
    }catch(err){
        res.status(500).send(err);
    }
}

const userFeed = async (req, res)=>{
    try{
        const allUsers = await User.find({});
        res.send(allUsers);
    }catch(err){
        res.status(500).send(err);
    }
}

const userUpdate = async (req, res)=>{
    const allowedFields = ["firstName", "lastName", "password", "gender", "age", "photoURL", "about", "skills"];

    try{
        const userId = req.params?.userId;
        const data = req.body;
        const skills = req.body?.skills || [];
        const fieldCheck = Object.keys(data).every((key) => allowedFields.includes(key));
        if(!fieldCheck){
            throw new Error("Trying Insert Enexpected Fields");
        }
        if(skills > 20){
            throw new Error("Max. 20 skills are allowed");
        }
        const value = await User.findByIdAndUpdate(userId, data, {returnDocument:"after"});
        res.send("Updated Succesfully"+value)
    }catch(err){
        res.status(500).send(err);
    }  
}

const userDelete = async (req, res)=>{
    try{
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("Deleted Data Succesfully"+value)
    }catch(err){
        res.status(500).send(err);
    }  
}


module.exports = { 
    userSignUp,
    userLogin,
    userprofile,
    findUserByEmail, 
    userFeed, 
    userUpdate, 
    userDelete 
};