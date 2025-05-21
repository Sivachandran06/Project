require("dotenv").config();
const express = require("express");
const cros = require("cors");
const path = require("path");
const contentDb = require("./config/Db");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware to handel CROS
app.use(
    cros({
        origin: process.env.CLIENT_URL || "*",
        methods:["GET","PUT","POST","DELET"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
// Connect Database
contentDb()

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/task", userRouters);
// app.use("/api/reports", reportRoutes);

//Star Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))