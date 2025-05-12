const express = require("express");
const mongoDBConnection = require("./config/database");
const routes = require("./controller/userController");

const app = express();

app.use(express.json());
app.post("/signup", routes.userSignUp);
app.get("/user", routes.findUserByEmail);
app.get("/feed", routes.userFeed);
app.patch("/user/:userId", routes.userUpdate);
app.delete("/user", routes.userDelete);


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