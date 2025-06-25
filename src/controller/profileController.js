const bcrypt = require("bcrypt");
const path = require('path');

const { editProfileValidation,forgotPasswordValidation } = require("../helpers/validation");
const users = require("../models/users");

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
            // console.log(req.body);

            Object.keys(req.body).forEach((field) => {
                if(field === "skills[]"){
                    validateUser["skills"] = Array.isArray(req.body['skills[]']) ? req.body['skills[]'] : [req.body['skills[]']];
                }else{
                    validateUser[field] = req.body[field];
                }
                // console.log(validateUser);
            } );
            if (req.files && req.files.profileImage) {
                const image = req.files.profileImage;
                const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
                const uploadPath = path.join(__dirname, '../../profileimages');
                const ext = path.extname(image.name);

                if(!allowedExt.includes(ext.toLowerCase())){
                    return res.status(500).json({
                        "status": "error",
                        "message": "Please enter a valid image"
                    });
                }
                const fileName = Date.now() + '_' + image.name;
                const savePath = path.join(uploadPath, fileName);
                await image.mv(savePath, (err) => {
                    if (err) return res.status(500).json({
                        "status": "error",
                        "message": "File save failed", 
                        "details": err
                    });
                })

                validateUser["photoURL"] = "profileimages/"+fileName;
                // console.log(uploadPath);
            }
            console.log(req.body['skills[]']);
            console.log(validateUser);
            const updatedUser= await validateUser.save();
            res.json({
                "status": "success",
                "message": "Profile is updated succesfully",
                "data": updatedUser
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
            // let validateUser = req.user;

            const { emailId } = req.body;

            const validEmailCheck = await users.findOne({emailId});

            console.log(validEmailCheck);

            if(validEmailCheck){
                
                const newEncryptedPassword = await bcrypt.hash(req.body.password, 10);
                validEmailCheck.password = newEncryptedPassword;
                await validEmailCheck.save();
                res.json({
                    "status": "success",
                    "message": "Password updated succesfully."
                });
               
            }else{
                res.json({
                    "status": "error",
                    "message": "This email id is not registered."
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