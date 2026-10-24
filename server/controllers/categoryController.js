const Category = require("../model/Category");
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    
    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    let category;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(req.params.id);
    } else {
      category = await Category.findOne({ slug: req.params.id });
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    
    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, image, description } = req.body;
    
    // Check if category exists
    const categoryExists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }
    
    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, "-"),
      image,
      description,
    });
    
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    
    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;
    category.image = req.body.image || category.image;
    category.description = req.body.description || category.description;
    category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;
    
    const updatedCategory = await category.save();
    
    res.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    
    // Check if category has products
    const Product = require("../models/Product");
    const productsCount = await Product.countDocuments({ category: category._id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productsCount} products associated.`,
      });
    }
    
    await category.deleteOne();
    
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};