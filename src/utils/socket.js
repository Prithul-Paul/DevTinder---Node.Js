const socket = require("socket.io");
const crypto = require("crypto");

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
        socket.on("sendMessage", ({currentUserName, currentUserId, targetUserId, newMessage})=> {
            // console.log(currentUserName + " Sent : " + newMessage);
            
            io.to(getUniqueRoomId(currentUserId, targetUserId)).emit("messageRecieved", {currentUserId, currentUserName, newMessage});
        });
        socket.on("disconnect", ()=> {});
    });
}

module.exports = initializeSocetSetup;