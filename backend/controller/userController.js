const Task = require("../models/Task")
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc Get all users (Admin only );
//@route GET/api/users/ 
//@access Private (Admin)

const getUsers = async(req, res)=>{
    try{
        const user = await User.find({role: 'member'}).select("-password");
        
        //Add task Count to each User
        const userWithTaskCounts = await Promise.all(user.map(async(user)=>{
            const pendingTasks= await Task.countDocuments({assignedTo: user._id, status:"pending"});
            const inProgressTask = await Task.countDocuments({assignedTo: user._id, status:"In progress"});
            const completedTask = await Task.countDocuments({assignedTo: user._id, status: "Completed"});

            return {
                ...user._doc, //include all exixting user data
                pendingTasks,
                inProgressTask,
                completedTask,
            };
        }));

        res.json(userWithTaskCounts);
    }catch (error){
        res.status(500).json({message:"Server error", error: error.message})
    }
};

// @desc Get User by ID
// @route GEt/api/users/:id
// @access Private (Admin)
const getUserById = async(req, res)=>{
    try{
        const user = await User.findById(req.params.id).select("-Password");
        if(!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    }catch (error){
        res.status(500).json({message:"Server error", error: error.message})
    }
};

module.exports = {getUsers,getUserById}