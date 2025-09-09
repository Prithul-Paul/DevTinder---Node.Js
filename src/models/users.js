const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 1,
        maxLength: 255
    },
    lastName: {
        type: String,
        minLength: 1,
        maxLength: 255
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String
    },
    otpExpiresIn: {
        type : Date,
        default: Date.now
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    dob:{
        type: String,
    },
    photoURL:{
        type: String,
        default: "profileimages/no-profileimage.png",
        // validate(value) {
        //     if(!validator.isURL(value)){
        //         throw new Error("URL not valid");
        //     }
        // }
    },
    about:{
        type: String,
        default: "Add your bio"
    },
    skills:{
        type: [String]
    }
},
{
    timestamps: true
});
// userSchema.virtual('age').get(function () {
//     const formattedDob = new Date(this.dob);
//     const today = new Date();

//     let age = today.getFullYear() - formattedDob.getFullYear();
//     const monthDiff = today.getMonth() - formattedDob.getMonth();
//     const dayDiff = today.getDate() - formattedDob.getDate();

//     // If birthday hasn't occurred yet this year
//     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
//         age--;
//     }
//     return age;
// });
// userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", userSchema);