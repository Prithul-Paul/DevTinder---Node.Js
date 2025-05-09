const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    }
});

module.exports = mongoose.model("User", userSchema);