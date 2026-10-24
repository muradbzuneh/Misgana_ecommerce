const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authMiddleware, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin only routes
router.post("/", authMiddleware, admin, createCategory);
router.put("/:id", authMiddleware, admin, updateCategory);
router.delete("/:id", authMiddleware, admin, deleteCategory);

module.exports = router;