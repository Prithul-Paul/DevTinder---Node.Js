const validator = require("validator");
const signupValidation = (req, res)=>{
    let { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName){
        return res.status(401).json({error: "First Name or Last name can not be empty"});
    }else if(!validator.isEmail(emailId)){
        return res.status(401).json({error: "Email formate is not correct"});
    }else if(!validator.isStrongPassword(password)){
        return res.status(401).json({error: "Enter a strong password"});
    }
}

const editProfileValidation = (req)=>{
    const editableFields = ["firstName", "lastName", "gender", "profileImage", "about", "skills[]"];
    const isEditableFields = Object.keys(req.body).every(field => editableFields.includes(field));
    return isEditableFields;
}

const forgotPasswordValidation = (req)=>{
    const editableFields = ["password", "currentPassword"];
    const isEditableFields = Object.keys(req.body).every(field => editableFields.includes(field));
    let { password, currentPassword } = req.body;
    if(isEditableFields){
        if(!password || !currentPassword){
        
            throw new Error("Both fields should not be empty");

        }else if(req.body.currentPassword === req.body.password){

            throw new Error("New password should not be same as current password.");
            
        }else if(!validator.isStrongPassword(password)){ 
            throw new Error("Strong password needed.");
        }
        return true;
    }else{
        return false;

    }
}

module.exports = {
    signupValidation,
    editProfileValidation,
    forgotPasswordValidation
}