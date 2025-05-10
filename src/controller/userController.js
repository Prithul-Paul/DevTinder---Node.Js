const User = require("../models/users");
const userSignUp = async (req, res)=>{
    // console.log(req.body);
    const user = new User(req.body);
    try{
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
    try{
        const userId = req.body.userId;
        const data = req.body;
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