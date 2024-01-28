const jwt = require("jsonwebtoken");
const jwtSecret = "Welcome$";

const fetchuser = (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error: "Please Provide A Valid Token"});
    }
    const userData = jwt.verify(token,jwtSecret); 
    req.user = userData.user;
    next();
}
module.exports = fetchuser;
