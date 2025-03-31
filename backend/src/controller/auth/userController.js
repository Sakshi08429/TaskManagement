import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModels.js";
import generateToken from "../../helpers/generateToken.js";
import  bcrypt, { hash } from "bcryptjs";
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
    role,
    isVerified,
    token,
   })
    }
    else{
        res.status(400).json({message:"Invalid user data"});
    }
   
   
})




//user login
export const loginUser=asyncHandler(async(req,res)=>{
   //get email and password from req.body
   const {email,password}=req.body;
    //validation
    if( !email || !password){
        //400 bad request
          return res.status(400).json({message:"Please fill all the fields"});
       }

       //check ids user exists
       const userExists=await User.findOne({email});
       if(!userExists){
        return res.status(400).json({message:"User does not found, sign up!"});
       }
       //simply check the password
       //const isMatch=await userExists.matchPassword(password)

       //check if password matches the hashed password in database
      
        const isMatch=await bcrypt.compare(password,userExists.password) 

        if(!isMatch){
          //400 bad request
          return res.status(400).json({message:"Invalid password"});  
        }


        //generate token with userid
        const token=generateToken(userExists._id);

        if(userExists&&isMatch){
            const{ _id,name,email,photo,bio,isVerified}=userExists;
            //201 created
          res.cookie("token",token,{
            path:"/",
            httpOnly:true,
            maxAge:30*24*60*60*1000, //30 days
            sameSite:true,
            secure:true,
          })


          //send back the user data and the token in the response to client
            res.status(201).json({
                _id,
                name,
                email,
                role,
                photo,
                bio,
                isVerified,
                token,
            })}
            else{
                res.status(400).json({message:"Invalid email or password"});
            
        }

})



//user logout
export const logoutUser=asyncHandler(async(req,res)=>{
  res.clearCookie("token");
  res.status(200).json({message:"User logged out successfully"});
})



//get user profile
export const getUser=asyncHandler(async(req,res)=>{
  //get user details from the token==> excluding the password
  const user=await User.findById(req.user._id).select("-password");
  if(user){
    res.status(200).json(user);
  }
  else{
    res.status(400).json({message:"User not found"});
  }

})


//update user
export const updateUser=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user._id);
  if(user){
    const{name ,bio,photo}=req.body;
    //update the property
    user.name=req.body.name||user.name;
  user.bio=req.body.bio||user.bio;
  user.photo=req.body.photo||user.photo;

  const updated=await user.save();

  res.status(200).json({
    _id:updated._id,
    name:updated.name,
    email:updated.email,
    role:updated.role,
    photo:updated.photo,
    bio:updated.bio,
    isVerified:updated.isVerified,
  })}
  else{
    res.status(400).json({message:"User not found"});
  }

  
})