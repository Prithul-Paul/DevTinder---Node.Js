const bcrypt = require("bcrypt");
const { editProfileValidation,forgotPasswordValidation } = require("../helpers/validation");

const userProfile = async (req, res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.status(500).send(err.message);
    } 

}
const userProfileEdit = async (req, res)=>{
    try{
        if(editProfileValidation(req)){
            let validateUser = req.user;
            // console.log(validateUser);
            Object.keys(req.body).forEach((field) => {
                validateUser[field] = req.body[field];
            } );
            // console.log(validateUser);
            await validateUser.save();
            res.json({
                "status": "success",
                "message": "Profile is updated succesfully"
            });

        }else{
            res.status(500).json(
                {
                    "status": "error",
                    "message": "Invalid field in update"
                }
            );
        };
    }catch(err){
        res.status(500).send(err.message);
    } 

}

const frogotPassword = async (req, res)=>{
    try{
        if(forgotPasswordValidation(req)){
            let validateUser = req.user;
            if(await bcrypt.compare(req.body.currentPassword, validateUser.password)){
                const newEncryptedPassword = await bcrypt.hash(req.body.password, 10);
                validateUser.password = newEncryptedPassword;
                await validateUser.save();
                res.json({
                    "status": "success",
                    "message": "Password updated succesfully."
                });
            }else{
                res.status(500).json({
                    "status": "error",
                    "message": "Please put current password correctly."
                });
            }
        }
        else{
            res.status(500).json(
                {
                    "status": "error",
                    "message": "Invalid field in update"
                }
            );
        };
    }catch(err){
        res.status(500).send(err.message);
    } 

}

module.exports = { 
    userProfile,
    userProfileEdit,
    frogotPassword
};