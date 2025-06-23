export const BASE_URL = "https://task-manager-backend-my7n.onrender.com";

//utils/apiPaths.js
export const API_PATHS ={
    AUTH:{
        REGISTER: "/api/auth/register", //Regester a new user(Admin or Member)
        LOGIN: "/api/auth/login", //Authentication user & return JWT token
        GET_PROFILE: "/api/auth/profile", //Get logged-in user details
    },

    USERS:{
        GET_ALL_USERS:"/api/users",// Get all users (Admin only)
        GET_USER_BY_ID: (userId)=> `/api/users/${userId}`, // Get user by ID
        CREATE_USER:"/api/users", // Create a new user (Admin Only)
        UPDATE_USER: (userId)=>`api/users/${userId}`, //Update user details
        DELETE_USER: (userId)=>`api/users/${userId}`, //Delete a user
    },

    TASKS:{
        GET_DASHBOARD_DATA:"/api/tasks/dashboard-data",// Get dashboard Data
        GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data", //Get User Dashboard Data
        GET_ALL_TASKS:"/api/tasks",//Get all Tasks(Admin: all, User:only assignment tasks)
        GET_TASK_BY_ID: (taskId)=>`/api/tasks/${taskId}`,//Get task by ID
        CREATE_TASK: "/api/tasks", //Create a new task (Admin only)
        UPDATE_TASK: (taskId)=>`/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId)=>`api/tasks/${taskId}`, //Delete a task (Admin only)

        UPDATE_TASK_STATUS: (tasksId) =>`/api/tasks/${tasksId}/status`, // Update tasks
        UPDATE_TASK_CHECKLIST: (taskId)=>`/api/tasks/${taskId}/todo`, //update todo checklist
    },

    REPORTS:{
        EXPORT_TASKS: "/api/reports/export/tasks", //Download all tasks as an Excel/PDF report 
        EXPORT_USERS: "/api/reports/export/user", // Downlode user-task report
    },

    IMAGE: {
        UPLOAD_IMAGE: "api/auth/upload-image",
    },
};