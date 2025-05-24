const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    formUserId: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["interested", "ignored", "accepted", "rejected"],
        required: true
    }

},
{ 
    timestamps : true
});
connectionRequestSchema.pre("save", async function(next){
    const connectionRequest = this;

    if(connectionRequest.formUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can not sent the request");
    }

    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;