const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: true,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentIntentId: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Pending"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    trackingNumber: {
      type: String,
      default: "",
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Generate order ID before saving
orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD-${uuidv4()}`;
  }

  // Set status color based on status
  const statusColors = {
    Processing: "orange",
    Shipped: "blue",
    Delivered: "green",
    Cancelled: "red",
    Pending: "yellow",
  };
  this.statusColor = statusColors[this.status] || "orange";

  // Set delivered date
  if (this.status === "Delivered" && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  // Set cancelled date
  if (this.status === "Cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }

});

module.exports = mongoose.model("Order", orderSchema);
