const Task = require("../models/Task");

// @desc Get all tasks (Admin: all, User: only assined task)
// @route GET /api/tasks/
// @access Private

const getTask = async (req, res) => {
    try {
        const {status} = req.query;
        let filter = {};
        if(status){
            filter.status = status;
        }

        let tasks;
        if(req.user.role === "admin"){
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        }else{
            tasks = await Task.find({...filter,assignedTo:req.user._id}).populate("assignedTo", "name email profileImageUrl");
        }

        //Add completed todoCheckList Count to each task 
        tasks = await Promise.all(tasks.map(async(task)=>{
            const completedCount = task.todoCheckList.filter((item)=>item.completed).length;
            return {...task._doc, completedTodoCount:completedCount};
            })
        );

        // Status summary count
        const allTask = await Task.countDocuments(
            req.user.role === "admin"?{}:{assignedTo:req.user._id}
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
        });
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
        });
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
        });

        res.json({
            tasks,
            statsuSummary:{
                all: allTask,
                pendingTasks,
                inProgressTasks,
                completedTasks
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get task by id
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Creat New task (Admin Only)
// @route POST /api/tasks/
// @access Private(Admin)
const creatTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "assingto must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoCheckList,
            attachments,
        });

        res.status(201).json({ message: "Task created successfully", task });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc update task details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Delete a task (Admin Only)
// @route DELETE /api/tasks/:id
// @access Private(Admin)
const deleteTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Update task status
// @route PUT /api/tasks/:id/staus
// @access Pivate
const updateTaskStatus = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Update Task Check list
// @route PUT /api/tasks/:id/todo
// @access Private
const updateTaskCheckList = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Dashboard Data (Admin Only)
// @route GET /api/tasks/dashboard-data
// @access Private
const getDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Dashboard Data (User-specific)
// @route GET /api/task/user-dashboard-data
// @access Private
const getuserDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


module.exports = {
    getTask,
    getTaskById,
    creatTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getDashboardData,
    getuserDashboardData,
}