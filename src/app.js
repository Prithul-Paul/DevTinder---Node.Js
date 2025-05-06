const express = require("../node_modules/express");

const app = express();

app.use("/", (req, res)=>{
    res.send("Hello From Dashboard!!!!!");
})

app.use("/hello", (req, res)=>{
    res.send("Hello!!!!");
})

app.use("/about", (req, res)=>{
    res.send("Hello World!");
})

app.listen(3000, ()=>{
    console.log("Server is running....");
});