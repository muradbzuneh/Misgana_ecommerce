const mongoose = require("mongoose");
const slugify =require("slugify") ;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    oldPrice: {
      type: Number,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
    },

    images: [String],

    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },

    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    discount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



productSchema.pre("save", function (next) {
  if (this.isModified("name") && this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

productSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

module.exports = mongoose.model("Product", productSchema);