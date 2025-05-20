const mongoose = require('mongoose');

const ConnectionRequest = require("../models/connection-request");
const User = require("../models/users");
const sendConnectionRequest = async (req, res) => {
    try{
        const allowedStatus = ["interested", "ignored"];
        const status = req.params.status;
        const formUserId = req.user._id;
        const toUserId = req.params.userId;
        let successMsg;
        if(!allowedStatus.includes(status)){
            return res.status(400).json({"status": "error", "message": "Invalid Status"})
        }

        if(formUserId.equals(toUserId)){
            return res.status(400).json({"status": "error", "message": "Invalid User"})
        }

        if(mongoose.Types.ObjectId.isValid(toUserId)){
            const toUser = await User.findById(toUserId);
            if(!toUser){
                return res.status(400).json({"status": "error", "message": "Invalid User"})
            }
        }else{
            return res.status(400).json({"status": "error", "message": "Invalid User"})
        }

        const isConnectionRequestAllowed =  await ConnectionRequest.findOne({
            $or: [
                { formUserId, toUserId},
                { formUserId : toUserId, toUserId : formUserId}
            ]
        }); 

        if(isConnectionRequestAllowed){
            return res.status(400).json({"status": "error", "message": "Can't sent Request to this user"});
        }

        const connectionRequest = ConnectionRequest({
            formUserId,
            toUserId,
            status
        });
        await connectionRequest.save();
        if(status === "interested"){
            successMsg = "Connection Request Sent!!!";
        }else if(status === "ignored"){
            successMsg = "Connection Request Ignored!!!";
        }
        res.json({"status": "success", "message": `${successMsg}`});

    }catch(err){
        res.status(500).send(err.message);
    } 
    
}




module.exports = {
    sendConnectionRequest
}