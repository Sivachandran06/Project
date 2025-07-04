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
        const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

        if(!task) return res.status(404).json({message: "Task not found"});

        res.json(task);
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
            attachment,
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
            attachment,
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
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = req.body.title || task.title; // fixed typo 'titel'
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
        task.attachment = req.body.attachment || task.attachment;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", updatedTask });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Delete a task (Admin Only)
// @route DELETE /api/tasks/:id
// @access Private(Admin)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"Task not found"});

        await task.deleteOne();
        res.json({message: "Task deleted Successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Update task status
// @route PUT /api/tasks/:id/staus
// @access Pivate
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});

        const isAssigned = task.assignedTo
        .some(
            (userId)=> userId.toString()=== req.user._id.toString()
        );
        if(!isAssigned && req.user.role !=="admin"){
            return res.status(403).json({ message: "Not autherized"});
        }
        task.status = req.body.status || task.status;

        if(task.status === "Completed"){
            task.todoCheckList.forEach((item)=>(item.completed = true));
            task.progress = 100;
        }
        await task.save();
        res.json({message: "Task status update",task});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Update Task Check list
// @route PUT /api/tasks/:id/todo
// @access Private
const updateTaskCheckList = async (req, res) => {
    try {
        const {todoCheckList} = req.body;
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"Task not Found"});

        if(!task.assignedTo.includes(req.user._id)&& req.user.role !=="admin"){
            return res.status(403).json({message:"Not authorized to update checkList"});
        } 
        task.todoCheckList = todoCheckList; // Replace with Updated CheckList

        //Auto Update progress Base on checklist completion
        const completedCount = task.todoCheckList.filter((item)=>item.completed).length;

        const totalItems = task.todoCheckList.length;
        task.progress = totalItems >0? Math.round((completedCount / totalItems)*100):0;

        //Auto-mark task as completed if all items are checked
        if(task.progress === 100){
            task.status = "Completed";
        }else if(task.progress >0){
            task.status = "In Progress";
        }else{
            task.status = "Pending";
        }

        await task.save();
        const updatedTask  = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
        res.json({message:"Task checkList Updated" , task: updatedTask })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Dashboard Data (Admin Only)
// @route GET /api/tasks/dashboard-data
// @access Private
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status:"Pending"});
        const completedTask = await Task.countDocuments({status: "completed"});
        const overdueTask = await Task.countDocuments({
            status: {$ne: "Completed"},
            dueDate:{$lt: new Date()},
        });

        //Ensuer all possible statuses are included
        const taskStatuses =["Pending","In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum: 1},
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc,status)=>{
            const formattedkey = status.replace(/\s+/g,""); //removing space for responce keys
            acc[formattedkey]= taskDistributionRaw.find((item)=> item._id === status)?.count|| 0;
            return acc;
        },{});
        taskDistribution["All"]=totalTasks; //Add total count to taskDistribution

        //Ensure all priority levels are included
        const taskPriorities =["Low","Medium","High"];
        const taskPrioritiesLevelRaw = await Task.aggregate([
            {
                $group:{
                    _id:"$priority",
                    count:{$sum: 1},
                },
            },
        ]);
        const taskPrioritiesLevels = taskPriorities.reduce((acc,priority)=>{
            acc[priority]= taskPrioritiesLevelRaw.find(item=>item._id===priority)?.count|| 0;
            return acc;
        },{});
        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
        .sort({createdAt: -1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTask,
                overdueTask,
            },
            charts:{
                taskDistribution,
                taskPrioritiesLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Dashboard Data (User-specific)
// @route GET /api/task/user-dashboard-data
// @access Private
const getuserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        ///Fetch statistics for user-Specific Task
        const totalTasks = await Task.countDocuments({assignedTo:userId});
        const pendingTasks = await Task.countDocuments({assignedTo: userId, status: "Pending"});
        const completedTask = await Task.countDocuments({assignedTo: userId, status: "Completed"});
        const overdueTask = await Task.countDocuments({
            assignedTo: userId,
            status: {$ne:"Completed"},
            dueDate: {$lt: new Date()},
        });

        // Task distribution by status
        const taskStatuses =["Pending","In Progress","Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: {assignedTo: userId}},
            { $group: {_id: "$status", count:{ $sum: 1}}},
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status)=>{
            const formattedkey = status.replace(/\s+/g,"");
            acc[formattedkey] = 
            taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        },{});
        taskDistribution["All"]= totalTasks;

        //TAsk distribution by Priority
        const taskPriorities = ["low", "Medium", "High"];
        const taskPrioritiesLevelRaw = await Task.aggregate([
            { $match: {assignedTo: userId}},
            { $group: {_id: "$priority", count:{ $sum: 1}}},
        ]);
        const taskPrioritiesLevels = taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
            taskPrioritiesLevelRaw.find((item)=> item._id === priority)?.count || 0;
            return acc;
        },{});

        //Fetch recent 10 task for the logged-in user
        const recentTasks = await Task.find({assignedTo: userId})
        .sort({createdAt: -1})
        .limit(10)
        .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTask,
                overdueTask,
            },
            charts:{
                taskDistribution,
                taskPrioritiesLevels,
            },
            recentTasks,
        });
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