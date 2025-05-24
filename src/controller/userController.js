const ConnectionRequest = require("../models/connection-request");

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
        ConnectionRequest.find(
            {
                $or: [
                    {formUserId : loggedInUserId},
                    {toUserId : loggedInUserId},
                ],
                status : "accepted"
            }
        );

    }catch(err){
        res.status(500).send(err.message);
    }
}

module.exports = {
    connectionRequests,
    connectedUsers
}