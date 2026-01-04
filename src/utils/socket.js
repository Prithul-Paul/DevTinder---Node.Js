const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const initializeSocetSetup = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    const getUniqueRoomId = (currentUserId, targetUserId)=>{
        // console.log(currentUserId, targetUserId);
        
        const sortedIds = [currentUserId, targetUserId].sort().join("_");
        return crypto.createHash("sha256").update(sortedIds).digest("hex").slice(0, 16);

    }
    // console.log(getUniqueRoomId());
    
    io.on("connection", (socket) => {
        socket.on("joinChat", ({currentUserName, currentUserId, targetUserId})=> {
            // console.log(targetUserId);
            
            console.log(currentUserName + " Joined Room Id: "+getUniqueRoomId(currentUserId, targetUserId));

            socket.join(getUniqueRoomId(currentUserId, targetUserId));
            
        });
        socket.on("sendMessage", async ({currentUserName, currentUserId, targetUserId, newMessage})=> {
            // console.log(currentUserName + " Sent : " + newMessage);
            try{
                let chat = await Chat.findOne({
                    participents: {$all: [currentUserId, targetUserId]}
                });

                if(!chat){
                    chat = new Chat({
                        participents: [currentUserId, targetUserId],
                        message: []
                    })
                }
                chat.message.push({
                    senderId: currentUserId,
                    textMessage: newMessage
                });
                // chat.lastModifiedAt = new Date();

                await chat.save();
                
                io.to(getUniqueRoomId(currentUserId, targetUserId)).emit("messageRecieved", {currentUserId, currentUserName, newMessage});
                
            }catch(err){
                console.log(err.message);
            }
        });
        socket.on("disconnect", ()=> {});
    });
}

module.exports = initializeSocetSetup;