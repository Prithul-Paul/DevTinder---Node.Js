const express = require("express");
const mongoDBConnection = require("./config/database");
const userSignUp = require("./controller/userController");

const app = express();


app.post("/signup", userSignUp);


mongoDBConnection().
then(()=>{
    console.log("DB connection is succesfull...");
    app.listen(3000, ()=>{
        console.log("Server is running....");
    });
}).
catch((err)=>{
    console.log("Problem to connect database..."+ err);
})