import jwt from "jsonwebtoken"
import User from "../models/userModels.js"
import asyncHandler from "./asyncHandler.js"

// authenticate the user
const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        return res.status(401).json({
            message: "Unauthorized request"
          })  
        
      }
     
      console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET); // Add logging
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
      if (!user) {
        return res.status(401).json({
            message: "Invalid Access Token"
          })  
        
       
      }
  
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message:error.message || "Invalid Access Token"
      })  
    
    }
  });
  
// authorized the user

const authorized=asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        return next()
    }
    else{
        res.status(401).send("Not Authorized as an Admin")
    }
})

export{
    verifyJwt,
    authorized
}