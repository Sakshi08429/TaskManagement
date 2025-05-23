import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModels.js";
import generateToken from "../../helpers/generateToken.js";
import  bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../../models/auth/Token.js";
import  crypto from "node:crypto"
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";


export const registerUser=asyncHandler(async(req,res)=>{
    //validation
   const {name,email,password,role}=req.body;
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
        role: role || "user",

     })

const token=generateToken(user._id);
// console.log(token);
//send back the user data and the token in the response to client

res.cookie("token",token,{
  path:"/",
  httpOnly:true,
  maxAge:30*24*60*60*1000, //30 days
  sameSite:"none",
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
            sameSite:"none",
            secure:true,
          })


          //send back the user data and the token in the response to client
            res.status(201).json({
                _id,
                name,
                email,
                role:"user"||role,
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
  // if (name !== undefined) user.name = name;
  // if (bio !== undefined) user.bio = bio;
  // if (photo !== undefined) user.photo = photo;

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



//user login status
export const userLoginStatus=asyncHandler(async(req,res)=>{
  const token=req.cookies.token;
  if(!token){
    res.status(401).json({message:"Not authorized , please log in"});
  }
//verify the token
  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  if(decoded){
    res.status(200).json(true);
  }
  else{
    res.status(401).json(false);
  }
})



//email verification
export const verifyEmail=asyncHandler(async(req,res)=>{
const user=await User.findById(req.user._id);
if(!user){
  return res.status(404).json({message:"User not found"});
}
if(user.isVerified){
  return res.status(400).json({message:"User already verified"});}


  let token =await Token.findOne({userId:user._id});
  //if token exists-->delete the token
  if(token){
    await token.deleteOne();
  }
  //create a verification token using crypto

  const verificationToken=crypto.randomBytes(64).toString("hex")+user._id;
  //host the verification token
  const hashedToken= await hashToken(verificationToken);
  await new Token({
userId:user._id,
verificationToken:hashedToken,
createdAt:Date.now(),
expiresAt:Date.now()+24*60*60*1000,

  }).save();


  //verification link
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
//send email to user
//subject, send_to, send_from, reply_to, template, name,link
const subject = "Email Verification - AuthKit";
const send_to = user.email;
const reply_to = "noreply@gmail.com";
const template = "emailVerification";
const send_from = process.env.USER_EMAIL;
const name = user.name;
const url = verificationLink;
try {
  // order matters ---> subject, send_to, send_from, reply_to, template, name, url
  await sendEmail( send_to, send_from,subject, reply_to, template, name, url);
  return res.json({ message: "Email sent" });
} catch (error) {
  console.log("Error sending email: ", error);
  return res.status(500).json({ message: "Email could not be sent" });
}
});


//verify user
export const verifyUser=asyncHandler(async(req,res)=>{
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid verification token" });
  }
  // hash the verification token --> because it was hashed before saving
  const hashedToken =await hashToken(verificationToken);
 
// console.log("Original Token:", verificationToken);
// console.log("Hashed Token:", hashedToken);

  // find user with the verification token
  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    

    // check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });
  }

  //find user with the user id in the token
  const user = await User.findById(userToken.userId);

  if (user.isVerified) {
    // 400 Bad Request
    return res.status(400).json({ message: "User is already verified" });
  }

  // update user to verified
  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "User verified" });
  
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    // 404 Not Found
    return res.status(404).json({ message: "User not found" });
  }

  // see if reset token exists
  let token = await Token.findOne({ userId: user._id });

  // if token exists --> delete the token
  if (token) {
    await token.deleteOne();
  }

  // create a reset token using the user id ---> expires in 1 hour
  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  // hash the reset token
  const hashedToken =await hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  }).save();
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  // send email to user
  const subject = "Password Reset - AuthKit";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL;
  const reply_to = "noreply@noreply.com";
  const template = "forgotPassword";
  const name = user.name;
  const url = resetLink;

  try {
    await sendEmail(send_to, send_from,subject ,reply_to, template, name, url);
    res.json({ message: "Email sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent" });
  }
});



export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // hash the reset token
  const hashedToken = hashToken(resetPasswordToken);

  // check if token exists and has not expired
  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    // check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // find user with the user id in the token
  const user = await User.findById(userToken.userId);

  // update user password
  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

// change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find user by id
  const user = await User.findById(req.user._id);

  // compare current password with the hashed password in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  // reset password
  if (isMatch) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } else {
    return res.status(400).json({ message: "Password could not be changed!" });
  }
});