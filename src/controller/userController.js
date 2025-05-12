const User = require("../models/users");
const validator = require("validator");
const userSignUp = async (req, res)=>{
    // console.log(req.body);
    const allowedFields = ["firstName", "lastName", "emailId", "password", "gender"];
    try{
        const fieldCheck = Object.keys(req.body).every((key) => allowedFields.includes(key));
        if(!fieldCheck){
            throw new Error("Trying Insert Enexpected Fields");
        }
        if(!validator.isEmail(req.body?.emailId)){
            throw new Error("Invalid Email");
        }
        const user = new User(req.body);
        await user.save();
        res.send("User Added Succesfully");
    }catch(err){
        res.status(500).send("Insertion unsuccesfull error: "+err);
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


module.exports = { userSignUp, findUserByEmail, userFeed, userUpdate, userDelete };