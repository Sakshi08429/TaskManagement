import asyncHandler from "express-async-handler";

export const registerUser=asyncHandler(async(req,res)=>{
    res.send("Register User");
})