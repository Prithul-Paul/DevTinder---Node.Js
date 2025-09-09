const User = require("../models/users");
const validations = require("../helpers/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {transporter} = require("../utils/nodeMailer");
const {sendOtpTemplateFnction} = require("../utils/mailTemplates");

const userSignUp = async (req, res)=>{
    try{
        validations.signupValidation(req, res);
        const {firstName, lastName, emailId, dob, password} = req.body;
        // console.log(dob);
        // return;
        const passwordHash = await bcrypt.hash(req.body?.password, 10);
        const user = new User({
            firstName,
            lastName,
            dob,
            emailId,
            password: passwordHash
        });
        const savedUser = await user.save();


        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie("usertoken", token, {
            expires: new Date(Date.now() + (60000 * 60)), // 1 hour from now
            httpOnly: true,
        });

        res.json({
            "status": "success",
            "message": "User signedup successfully!!!",
            "data": savedUser
        });
    }catch(err){
        res.status(500).send("error: "+err);
    }
}

const userEmailOtp = async (req, res)=>{
    const { emailId } = req.body;
    const now = new Date();

    const timestampNow = now.toISOString();
    try{
        if(!validator.isEmail(emailId)){
            return res.status(401).json({error: "Email formate is not correct"});
        }
        const validUserCheck = await User.findOne({emailId:emailId});
        if(!validUserCheck){
            return res.status(401).json({sucess: false, error: "Invalid Credential"});
        }else{
            // console.log(validUserCheck.otpExpiresIn > timestampNow);
            // return false;
            if(validUserCheck.otpExpiresIn && validUserCheck.otpExpiresIn.toISOString() > timestampNow ){
                return res.status(401).json({sucess: false, error: "You have already an active OTP"});
            }


            const otp = Math.floor(10000 + Math.random() * 90000);
            const otpHash = await bcrypt.hash(otp.toString(), 10);

            const now = new Date();
            const otpExpireTime = new Date(now.getTime() + 2 * 60 * 1000);
            const otpExpireTimestamp = otpExpireTime.toISOString();

            validUserCheck.otp = otpHash;
            validUserCheck.otpExpiresIn = otpExpireTimestamp;

            await validUserCheck.save();

            // console.log(otpHash);
            (async () => {
                const info = await transporter.sendMail({
                    from: '"TalkNest" <no-reply@talknest.com>',
                    to: emailId,
                    subject: "OTP Verification: TalkNest",
                    html: sendOtpTemplateFnction(otp), // HTML body
                });
                // console.log("Message sent:", info.messageId);
            })();
            return res.json({sucess: true, msg: "Mail sent successfully!!"});
        }
    }catch(err){
        res.status(401).send(err.message);
    } 

}

const userLogin = async (req, res) => {
    const { emailId, otp } = req.body;
    const now = new Date();
    const timestampNow = now.toISOString();
    try{
        if(!validator.isEmail(emailId)){
            return res.status(401).json({error: "Email formate is not correct"});
        }
        const validUserCheck = await User.findOne({emailId:emailId});
        if(!validUserCheck){
            return res.status(401).json({sucess: false, error: "Invalid Credential"});
        }else{
            if(!validUserCheck.otp){
                return res.status(401).json({sucess: false, error: "Invalid OTP"});
            }
            let checkOtp = await bcrypt.compare(otp, validUserCheck.otp);

            
            if(!checkOtp){
                return res.status(401).json({success: false, error: "Invalid OTP"});
            }

            if(timestampNow > validUserCheck.otpExpiresIn.toISOString()){
                return res.status(401).json({success: false, error: "Invalid OTP"});
            }

            const token = jwt.sign({ userId: validUserCheck._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.cookie("usertoken", token, {
                expires: new Date(Date.now() + (60000 * 60)), // 1 hour from now
                httpOnly: true,
            });
            res.send(validUserCheck);
        }
    }catch(err){
        res.status(401).send(err.message);
    }
}

const userLogout = async (req, res)=>{
    // const {emailId, password} = req.body;
    try{
        res.cookie("usertoken", null, {
            expires: new Date(Date.now())
        }).send("Your are logged out!!!");
    }catch(err){
        res.send(err.message);
    } 
}


module.exports = {
    userSignUp,
    userEmailOtp,
    userLogin,
    userLogout
};