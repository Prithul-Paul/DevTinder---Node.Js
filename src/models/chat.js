const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    textMessage: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const chatSchema = new mongoose.Schema({
    participents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    message: [messageSchema]

});

const Chat = mongoose.model("Chat",chatSchema);

module.exports = {Chat};