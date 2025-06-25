const validator = require("validator");
const signupValidation = (req, res)=>{
    let { firstName, lastName, emailId, dob, password } = req.body;

    const today = new Date();

    // const formattedDate = `${yyyy}-${mm}-${dd}`;

    const formattedDob = new Date(dob);
    let age = today.getFullYear() - formattedDob.getFullYear();
    const monthDiff = today.getMonth() - formattedDob.getMonth();
    const dayDiff = today.getDate() - formattedDob.getDate();

    // If birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    if(age < 18){
        return res.status(401).json({error: "Age should be above 18"});
    }
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
    const editableFields = ["emailId", "password"];
    const isEditableFields = Object.keys(req.body).every(field => editableFields.includes(field));
    let { password } = req.body;
    if(isEditableFields){
        if(!password){
            throw new Error("Both fields should not be empty");
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