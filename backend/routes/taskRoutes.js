const express = require("express");
const {protect, adminOnly}= require("../middleware/authMiddleware");
const { getDashboardData,getuserDashboardData, getTask, getTaskById, creatTask, updateTask, deleteTask, updateTaskStatus, updateTaskCheckList } = require("../controller/taskController");

const router = express.Router();

//Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data",protect, getuserDashboardData);
router.get("/",protect,getTask);
router.get("/:id",protect,getTaskById);
router.post("/",protect,adminOnly,creatTask);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,adminOnly,deleteTask);
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskCheckList);

module.exports = router;