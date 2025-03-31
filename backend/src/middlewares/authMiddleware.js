import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"
import User from "../models/auth/UserModels.js";
export const protect=asyncHandler(async(req,res,next)=>{
try{
 const token=req.cookies.token;
 if(!token){
    res.status(401).json({message:"Not authorized, no token"});
 }
//verify the user
 const decode=jwt.verify(token,process.env.JWT_SECRET);
//get user details from the taken==> exclude password
const user=await User.findById(decode.id).select("-password");

//check if user exist
if(!user){
    res.status(401).json({message:"User not found"});
}

//set user details in req  object
req.user=user;
next();

}
catch(error){
res.status(401).json({message:"Not authorized, token failed"});
}


}
)