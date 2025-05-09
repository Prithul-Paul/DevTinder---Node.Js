const mongoose = require("mongoose");

const mongoDBConnection = async ()=>{
    await mongoose.connect("mongodb://localhost:27017/devtinder");
}

module.exports = mongoDBConnection;

