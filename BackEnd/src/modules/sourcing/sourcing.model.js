// Backend/src/modules/sourcing/sourcing.model.js
import mongoose from "mongoose";

const sourcingRequestSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerName: {
      type: String,
      default: "Buyer",
    },
    cropType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: "q",
    },
    targetPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryRegion: {
      type: String,
      required: true,
      trim: true,
    },
    farmerCriteria: {
      region: { type: String, default: "" },
      certifiedOnly: { type: Boolean, default: false },
      notes: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["active", "fulfilled", "closed"],
      default: "active",
    },
    notifiedFarmerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    responses: [
      {
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        farmerName: String,
        action: { type: String, enum: ["accepted", "rejected", "offered"] },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const SourcingRequest = mongoose.model("SourcingRequest", sourcingRequestSchema);
export default SourcingRequest;
