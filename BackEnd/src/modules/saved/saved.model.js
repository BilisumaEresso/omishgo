import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true },
);

savedSchema.index({ buyerId: 1, productId: 1 }, { unique: true });

const Saved = mongoose.model("Saved", savedSchema);
export default Saved;
