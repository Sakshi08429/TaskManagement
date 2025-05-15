import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"
//import User from "../models/auth/UserModels";
import User from "../models/auth/UserModels.js";

export const protect=asyncHandler(async(req,res,next)=>{
try{
 const token=req.cookies.token;
 if(!token){
   return res.status(401).json({message:"Not authorized, no token"});
 }
//verify the user
 const decode=jwt.verify(token,process.env.JWT_SECRET);
//get user details from the taken==> exclude password
const user=await User.findById(decode.id).select("-password");

//check if user exist
if(!user){
    return res.status(401).json({message:"User not found"});
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



//admin middleware
export const adminMiddleware=asyncHandler(async(req,res,next)=>{
if(req.user &&req.user.role==="admin"){
    //if user is admin move to next middleware/ controller
next();
return;
}
//if not admin send 403 forbidden
res.status(403).json({message:"Not authorized as an admin"});

})


//user middleware
export const creatorMiddleware=asyncHandler(async(req,res,next)=>{
    if((req.user&&req.user.role==="creator")||(req.user&&req.user.role==="admin")){
        next();
        return;
    }
    res.status(403).json({message:"Not authorized as a creator"});
})

//verified middleware
export const verifiedMiddleware=asyncHandler(async(req,res,next)=>{
    if(req.user&&req.user.isVerified){
        next();
        return;
    }
    res.status(403).json({message:"Not authorized as a verified user, please verify your email"});
})

