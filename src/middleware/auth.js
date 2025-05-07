const adminAuth = (req, res, next)=>{
    console.log("Admin route passed");
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(401).send("User is un-authorized");
    }else{
        next();
    }
}
module.exports = {
    adminAuth
}