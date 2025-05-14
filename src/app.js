const express = require("express");
const cookiePerser = require("cookie-parser");
const mongoDBConnection = require("./config/database");
const userController = require("./controller/userController");

const app = express();

app.use(express.json());
app.use(cookiePerser());

app.post("/signup", userController.userSignUp);
app.post("/login", userController.userLogin);
app.get("/profile", userController.userprofile);
app.get("/user", userController.findUserByEmail);
app.get("/feed", userController.userFeed);
app.patch("/user/:userId", userController.userUpdate);
app.delete("/user", userController.userDelete);


mongoDBConnection().
then(()=>{
    console.log("DB connection is succesfull....");
    app.listen(3000, ()=>{
        console.log("Server is running....");
    });
}).
catch((err)=>{
    console.log("Problem to connect database..."+ err);
})