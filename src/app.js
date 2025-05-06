const express = require("../node_modules/express");

const app = express();



app.get("/user", (req, res)=>{
    res.send({firstName: "Prithul", lastName:"Paul"})
})
app.post("/user", (req, res)=>{
    res.send("Data saved successfully");
})
app.delete("/user", (req, res)=>{
    res.send("Data deleted successfully");
})
app.use("/user", (req, res)=>{
    res.send("User for all");
})

app.use("/test", (req, res)=>{
    res.send("Hello World!");
})





app.listen(3000, ()=>{
    console.log("Server is running....");
});