const validator = require("validator");
const signupValidation = (req)=>{
    let { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter a valid name");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email id");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
}

const editProfileValidation = (req)=>{
    const editableFields = ["firstName", "lastName", "gender", "age", "photoURL", "about", "skills"];
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