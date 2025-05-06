const express = require("../node_modules/express");

const app = express();





app.use("/user/:userId/:name/:password", (req, res) => {
    // console.log(req.query);
    console.log(req.params);
    res.send("Hello World!");
});





app.listen(3000, ()=>{
    console.log("Server is running....");
});