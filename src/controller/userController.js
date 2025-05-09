const User = require("../models/users");
const userSignUp = async (req, res)=>{
    const user = new User({
        firstName: "Pradip",
        lastName: "Paul",
        emailId: "ptithulpaul@gmail.com",
        password: "prithul@029160",
        gender: "male"
    });
    try{
        await user.save();
        res.send("User Added Succesfully");
    }catch(err){
        res.status(500).send("Insertion unsuccesfull error: "+err);
    }
}

module.exports = userSignUp;