import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {createTask,getTasks,getTask,updateTask,deleteTask} from "../controller/task/taskController.js";


const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);
router.patch("/task/:id", protect, updateTask);
router.delete("/task/:id", protect, deleteTask);

export default router;