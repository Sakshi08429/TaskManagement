import express from "express";
const router=express.Router();
import { logoutUser, registerUser,loginUser,getUser,updateUser } from "../controller/auth/userController.js";
import { protect,adminMiddleware } from "../middlewares/authMiddleware.js";
import { deleteUser } from "../controller/auth/adminController.js";

// router.get('/',(req,res)=>{
//     res.send("Hello from server");
// })


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.get("/user",protect,getUser);
router.patch("/user",protect,updateUser);

//admin routes
router.delete("/admin/users/:id",protect,adminMiddleware,deleteUser);


export default router;
