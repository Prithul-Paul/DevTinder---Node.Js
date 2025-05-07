const express = require("../node_modules/express");

const app = express();
    
const { adminAuth } = require("./middleware/auth");


app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res)=>{
    res.send("All data fetched");
})
app.get("/admin/deleteAdata", (req, res)=>{
    res.send("Deleted a data"); 
})




app.listen(3000, ()=>{
    console.log("Server is running....");
});