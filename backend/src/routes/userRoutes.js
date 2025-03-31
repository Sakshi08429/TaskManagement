import express from "express";
const router=express.Router();
import { logoutUser, registerUser,loginUser,getUser,updateUser } from "../controller/auth/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

// router.get('/',(req,res)=>{
//     res.send("Hello from server");
// })


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.get("/user",protect,getUser);
router.patch("/user",protect,updateUser);

export default router;
