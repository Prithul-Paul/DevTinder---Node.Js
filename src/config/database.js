const mongoose = require("mongoose");

const mongoDBConnection = async ()=>{
    await mongoose.connect(process.env.DATABASE_CONNECTION_STR);
}
module.exports = mongoDBConnection;