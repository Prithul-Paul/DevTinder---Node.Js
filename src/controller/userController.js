const mongoose = require("mongoose");
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
        const loggedInUserAge = req.user.age;
        const loggedInUserSkills = req.user.skills;

        const maxAgeRange = loggedInUserAge + 5;
        const minAgeRange = loggedInUserAge - 5;

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
        console.log(hideUserIds);
        const excludedIds = Array.from(hideUserIds)
        const excludedObjectIds = excludedIds.map(id => new mongoose.Types.ObjectId(id));
        // const priorityUsersOnfeed = await User.find({
        //     _id : {$nin: Array.from(hideUserIds)},
        //     age : {$gte : minAgeRange , $lte : maxAgeRange}
        // }).select("firstName lastName age gender photoURL about skills");

        // const normalUsersOnfeed = await User.find({
        //     _id : {$nin: Array.from(hideUserIds)},
        //     $or : [
        //         {age : {$gte : maxAgeRange , $lte : minAgeRange}},
        //         {age : {$exists : false}},
        //         {age :  null}
        //     ]
        // }).select("firstName lastName age gender photoURL about skills");


        const users = await User.aggregate([
                {
                    $match: {
                    _id: { $nin: excludedObjectIds }
                    }
                },
                {
                    $addFields: {
                        isCloseInAge: {
                            $cond: [
                                {
                                    $and: [
                                    { $gte: ["$age", minAgeRange] },
                                    { $lte: ["$age", maxAgeRange] }
                                    ]
                                },1,0
                            ]
                        },
                        commonSkillsCount: {
                            $size: {$setIntersection: ["$skills", loggedInUserSkills]}
                        }
                    }
                },
                {
                    $sort: {
                    isCloseInAge: -1,         // First priority: age range match
                    commonSkillsCount: -1,  // Second: more common skills
                    age: 1               // Optional: sort younger users first
                    }
                },
                {
                    $project: {
                    password: 0,
                    emailId: 0,
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0
                    }
                }
        ]);



        res.json({data : users});
        // res.json({data : [...priorityUsersOnfeed,...normalUsersOnfeed]});

    }catch(err){
        res.status(500).send(err.message);
    }
}
module.exports = {
    connectionRequests,
    connectedUsers,
    userFeed
}