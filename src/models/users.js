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
    password: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    age:{
        type: Number,
        min: 18
    },
    photoURL:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
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
}

);

module.exports = mongoose.model("User", userSchema);