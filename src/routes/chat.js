const express = require("express");
const chatRouter = express.Router();
const middelwares = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/users");

chatRouter.get("/chat/:targetUserId", middelwares.userAuth,  async (req, res)=>{
    const currentUserId = req.user._id;
    const { targetUserId } = req.params;

    let chat = await Chat.findOne({
        participents: {$all: [currentUserId, targetUserId]}
    });
    let userDetilas = await User.findById(targetUserId).select("firstName lastName photoURL");
    if(!chat){
        chat = new Chat({
            participents: [currentUserId, targetUserId],
            message: []
        })
        await chat.save();
    }
    res.send({userDetilas, chat});
});

chatRouter.get("/chatlist", middelwares.userAuth,  async (req, res)=>{
    const currentUserId = req.user._id;
    const chatList = await Chat.find({
        participents: currentUserId
    });

    const result = await Promise.all(
        chatList.map(async (chat)=>{
            const otherUserID = chat.participents.find(user => user.toString() !== currentUserId.toString());
            const otherUserDetails = await User.findById(otherUserID).select("firstName lastName photoURL");
            const lastMesg = chat.message[chat.message.length - 1];
            return {
                id: chat._id,
                textedTo: otherUserDetails,
                // participents: chat.participents,
                lastmsg: lastMesg
            }
        })
    );
    

    res.send(result);
});
module.exports = {chatRouter}