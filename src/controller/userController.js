const ConnectionRequest = require("../models/connection-request");
const User = require("../models/users");

const connectionRequests = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status: "interested"
        }).populate("formUserId", "firstName lastName gender age photoURL");
        
        // const data = connectionRequests.map((row) => {
        //     return row.formUserId;
        // })
        res.json({
            "status": "success",
            "data": connectionRequests
        });
    }catch(err){
        res.status(500).send(err.message);
    } 

}

const connectedUsers = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                {formUserId : loggedInUserId},
                {toUserId : loggedInUserId},
            ],
            status : "accepted"
        })
        .populate( "formUserId", "firstName lastName")
        .populate( "toUserId", "firstName lastName");

        const data = connections.map((row) => {
            if(row.formUserId._id.toString() === loggedInUserId.toString()){
                return row.toUserId
            }
            return row.formUserId
        })

        res.json({
            "status": "success",
            "data": data
        })

    }catch(err){
        res.status(500).send(err.message);
    }
}

const userFeed = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const hideUsersOnFeed = await ConnectionRequest.find({
            $or: [
                {formUserId: loggedInUserId},
                {toUserId: loggedInUserId}
            ]
        }).select("formUserId toUserId");

        const hideUserIds = new Set();

        hideUsersOnFeed.forEach((row)=>{
            hideUserIds.add(row.formUserId.toString());
            hideUserIds.add(row.toUserId.toString());
        });
        // console.log(hideUserIds);

        const usersOnfeed = await User.find({
            _id : {$nin: Array.from(hideUserIds)}
        }).select("firstName lastName age gender photoURL about skills");

        res.json({data : usersOnfeed});
    }catch(err){
        res.status(500).send(err.message);
    }
}
module.exports = {
    connectionRequests,
    connectedUsers,
    userFeed
}