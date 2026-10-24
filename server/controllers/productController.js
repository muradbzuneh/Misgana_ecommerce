const Product = require("../model/Product");
const Category = require("../model/Category");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug image");

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    // Check if the parameter is a valid ObjectId (24 hex characters)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Search by ID
      product = await Product.findById(id).populate(
        "category",
        "name slug image description",
      );
    } else {
      // Search by slug
      product = await Product.findOne({ slug: id }).populate(
        "category",
        "name slug image description",
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    let category;

    if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(categoryId);
    } else {
      category = await Category.findOne({ slug: categoryId });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ category: category._id })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Product.countDocuments({ category: category._id });

    res.json({
      success: true,
      category,
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      price,
      oldPrice,
      category,
      image,
      images,
      stock,
      discount,
      isFeatured,
    } = req.body;

    let categoryDoc;

    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: category }],
      });
    }

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = await Product.create({
      name,
      title,
      description,
      price,
      oldPrice,
      category: categoryDoc._id,
      image,
      images: images || [],
      stock: stock || 1,
      discount: discount || 0,
      isFeatured: isFeatured || false,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug",
    );

    res.status(201).json({
      success: true,
      product: populatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If category is being updated, verify it exists
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category. Category not found.",
        });
      }
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.oldPrice = req.body.oldPrice || product.oldPrice;
    product.category = req.body.category || product.category;
    product.image = req.body.image || product.image;
    product.images = req.body.images || product.images;
    product.stock =
      req.body.stock !== undefined ? req.body.stock : product.stock;
    product.discount =
      req.body.discount !== undefined ? req.body.discount : product.discount;
    product.isFeatured =
      req.body.isFeatured !== undefined
        ? req.body.isFeatured
        : product.isFeatured;

    if (req.body.rating) {
      product.rating = req.body.rating;
    }

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(
      updatedProduct._id,
    ).populate("category", "name slug");

    res.json({
      success: true,
      product: populatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isFeatured: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews?.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews = product.reviews || [];
    product.reviews.push(review);

    // Update average rating
    product.rating.rate =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    product.rating.count = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addProductReview,
};
