require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoDBConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const http = require("http");


const authRouters = require("./routes/auth");
const profileRouters = require("./routes/profile");
const requestRouters = require("./routes/request");
const userRouters = require("./routes/user");
const authProviderRouter = require("./routes/authProviderRouter");


const fileUpload = require("express-fileupload");
const path = require('path');
const initializeSocetSetup = require('./utils/socket');
const { chatRouter } = require('./routes/chat');

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173', // Allow only a specific origin
    credentials: true,
}));
app.use(fileUpload());
app.use('/profileimages', express.static(path.join(__dirname, '..', '/profileimages')));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouters);
app.use("/", profileRouters);
app.use("/", requestRouters);
app.use("/", userRouters);
app.use("/", chatRouter);

//Login with Google
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:5000 https://accounts.google.com;");
  next();
});

app.use("/auth", authProviderRouter);




//Socket intialization call
initializeSocetSetup(httpServer);

mongoDBConnection().
then(()=>{
    console.log("DB connection is succesfull....");
    httpServer.listen(process.env.PORT, ()=>{
        console.log("Server is running....");
    });
}).
catch((err)=>{
    console.log("Problem to connect database..."+ err);
})