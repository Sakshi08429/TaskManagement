import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModels.js";

export const deleteUser=asyncHandler(async(req,res)=>{
    // res.status(200).json({message:"User deleted successfully"});
    const {id}=req.params;

    //attempt to find and delete the user
    try{
    const user=await User.findByIdAndDelete(id);

    //check if user exists
    if(!user){
        res.status(400).json({message:"User not found"});}

        //delete  user
        res.status(200).json({message:"User deleted successfully"}); }
        catch(error){
            res.status(500).json({message:"Error deleting user"});
        }
})


//get all users
export  const getAllUsers=asyncHandler(async(req,res)=>{
    
    try{
        const users=await User.find({});
    if(!users){
        res.status(404).json({message:"No users found"});
    }
    res.status(200).json(users);}
    catch(error){
        res.status(500).json({message:"Error fetching users"});
    }
})