const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authMiddleware, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);

// Admin routes
router.get("/", authMiddleware, admin, getUsers);
router.get("/:id", authMiddleware, admin, getUserById);
router.put("/:id", authMiddleware, admin, updateUser);
router.delete("/:id", authMiddleware, admin, deleteUser);

module.exports = router;