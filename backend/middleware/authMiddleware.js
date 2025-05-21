const jwt = require("jsonwebtoken");
const User = require("../models/User");

//MiddleWare to Protuct route
const protect = async (req, res, next)=>{
    try{
        let token = req.headers.authorization;

        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1]; //Extract Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }else{
            res.status(401).json({message: "Not authorized , no token"});
        }
    }catch (error){
        res.status(401).json({message: "token Faild", error: error.message})
    }
}

// Middleware for Admin access
const adminOnly = (req,res,next)=>{
    if(req.user === req.user.role ==="admin"){
        next();
    }else{
        res.status(403).json({message:"Access denaide, Admin only "});
    }
};


module.exports = {protect,adminOnly};