const express = require("../node_modules/express");

const app = express();



app.get("/user", 
    [(req, res, next) => {
        console.log("Response handeler 1")
        next();
        // res.send("1st Response");
    },
    (req, res, next) =>{
        console.log("Response handeler 2")
        // res.send("2nd Response");
        next();
    },
    (req, res, next) =>{
        console.log("Response handeler 3")
        // res.send("3rd Response");
        next();
    },
    (req, res, next) =>{
        console.log("Response handeler 4")
        res.send("4th Response");
        // next();
    }]

);




app.listen(3000, ()=>{
    console.log("Server is running....");
});