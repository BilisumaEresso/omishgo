import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    unit: {
      type: String,
      default: "kg",
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    region: {
      type: String,
      default: "",
      trim: true,
    },
    images: [
      {
        type: String, // URLs to Cloudinary or similar
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Requires admin approval before going live
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
