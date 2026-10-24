const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  deleteOrder,
} = require("../controllers/orderController");
const { authMiddleware, admin } = require("../middleware/authMiddleware");

// Protected routes (user must be logged in)
router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Admin only routes
router.get("/", authMiddleware, admin, getAllOrders);
router.get("/stats", authMiddleware, admin, getOrderStats);
router.put("/:id/status", authMiddleware, admin, updateOrderStatus);
router.delete("/:id", authMiddleware, admin, deleteOrder);

module.exports = router;