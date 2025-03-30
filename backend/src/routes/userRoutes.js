import express from "express";
const router=express.Router();
import { registerUser } from "../controller/auth/userController.js";

// router.get('/',(req,res)=>{
//     res.send("Hello from server");
// })


router.post("/register",registerUser);

export default router;