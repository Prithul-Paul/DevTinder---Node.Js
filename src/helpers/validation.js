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

module.exports = {
    signupValidation
}