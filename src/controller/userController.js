const User = require("../models/users");
const validations = require("../helpers/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
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
        res.status(500).send("error: "+err);
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
                res.send("Login Succesful");
            }
        }
    }catch(err){
        res.send("Error"+ err);
    } 

}

const userProfile = async (req, res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.send("Something went wrong"+ err);
    }
}

const userFeed = async (req, res)=>{
    try{
        const allUsers = await User.find({});
        res.send(allUsers);
    }catch(err){
        res.send("Something went wrong"+ err);
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
        res.send("Something went wrong"+ err);
    }  
}

const userDelete = async (req, res)=>{
    try{
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("Deleted Data Succesfully"+value)
    }catch(err){
        res.send("Something went wrong"+ err);
    }  
}


module.exports = { 
    userSignUp,
    userLogin,
    findUserByEmail, 
    userFeed, 
    userUpdate, 
    userDelete 
};