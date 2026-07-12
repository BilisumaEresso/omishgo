import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer ID is required"],
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer ID is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    cropType: {
      type: String,
      required: [true, "Crop type is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unit: {
      type: String,
      default: "kg",
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for the most common queries
orderSchema.index({ buyerId: 1, status: 1 });
orderSchema.index({ farmerId: 1, status: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
