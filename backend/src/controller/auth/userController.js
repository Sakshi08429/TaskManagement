import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModels.js";
import generateToken from "../../helpers/generateToken.js";
export const registerUser=asyncHandler(async(req,res)=>{
    //validation
   const {name,email,password}=req.body;
   if(!name || !email || !password){
    //400 bad request
      return res.status(400).json({message:"Please fill all the fields"});
   }

       //check password length
       if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters"});
       }

       //check if user already exists
       const userExists=await User.findOne({email});
     //  console.log(userExists);

     if(userExists){
        return res.status(400).json({message:"User already exists"});
     }
        //create user

     const user= await User.create({
        name,
        email,
        password,
     })

const token=generateToken(user._id);
// console.log(token);
//send back the user data and the token in the response to client

res.cookie("token",token,{
  path:"/",
  httpOnly:true,
  maxAge:30*24*60*60*1000, //30 days
  sameSite:true,
  secure:true,
})






   if(user){
   const{ _id,name,email,photo,bio,isVerified}=user;

   //201 created
   res.status(201).json({
    _id,
    name,
    email,
    photo,
    bio,
    isVerified,
    token,
   })
    }
    else{
        res.status(400).json({message:"Invalid user data"});
    }
   
   
})