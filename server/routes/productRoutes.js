const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addProductReview,
} = require("../controllers/productController");
const { authMiddleware, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);

// Protected routes
router.post("/:id/reviews", authMiddleware, addProductReview);

// Admin only routes
router.post("/", authMiddleware, admin, createProduct);
router.put("/:id", authMiddleware, admin, updateProduct);
router.delete("/:id", authMiddleware, admin, deleteProduct);

module.exports = router;