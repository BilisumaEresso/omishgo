import mongoose from "mongoose";
import crypto from "crypto";

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer ID is required"],
    },
    cropType: {
      type: String,
      required: [true, "Crop type is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      default: "kg",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    photos: {
      type: [String], // Array of photo URLs
      default: [],
    },
    location: {
      region: { type: String, default: "" },
      zone: { type: String, default: "" },
      kebele: { type: String, default: "" },
      wereda: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: {
        values: ["active", "sold", "draft"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    customId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for the most common public query: active listings by cropType + region
productSchema.index({ status: 1, cropType: 1, "location.region": 1 });

productSchema.pre("save", function () {
  if (this.isNew && !this.customId) {
    this.customId = `PRD-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
