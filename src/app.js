const express = require("express");
const cookiePerser = require("cookie-parser");
const mongoDBConnection = require("./config/database");

const authRouters = require("./routes/auth");
const profileRouters = require("./routes/profile");
const requestRouters = require("./routes/request");
const userRouters = require("./routes/user");

const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouters);
app.use("/", profileRouters);
app.use("/", requestRouters);
app.use("/", userRouters);



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