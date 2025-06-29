const express = require("express");
const chatRouter = express.Router();
const middelwares = require("../middlewares/auth");
const { Chat } = require("../models/chat");

chatRouter.get("/chat/:targetUserId", middelwares.userAuth,  async (req, res)=>{
    const currentUserId = req.user._id;
    const { targetUserId } = req.params;

    let chat = await Chat.findOne({
        participents: {$all: [currentUserId, targetUserId]}
    });
    if(!chat){
        chat = new Chat({
            participents: [currentUserId, targetUserId],
            message: []
        })
        await chat.save();
    }
    res.send(chat);
});

module.exports = {chatRouter}