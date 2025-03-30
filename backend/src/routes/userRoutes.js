import express from "express";
const router=express.Router();
import { registerUser } from "../controller/auth/userController.js";
import { loginUser } from "../controller/auth/userController.js";

// router.get('/',(req,res)=>{
//     res.send("Hello from server");
// })


router.post("/register",registerUser);
router.post("/login",loginUser);

export default router;
