require("dotenv").config();
const express = require("express");
const cros = require("cors");
const path = require("path");
const contentDb = require("./config/Db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRouters = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware to handel CROS
app.use(
    cros({
        origin: process.env.CLIENT_URL || "*",
        methods:["GET","PUT","POST","DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);
// Connect Database
contentDb()

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRouters);
app.use("/api/reports", reportRoutes);

//Server Uploads folder
app.use("/uploads", express.static(path.join(__dirname,"uploads")));

//Star Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))