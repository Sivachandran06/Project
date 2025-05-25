const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getUsers,getUserById } = require("../controller/userController");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers); // Get all User(Admin Only)
router.get("/:id",protect,getUserById); // Get a specific user

module.exports = router