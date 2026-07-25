import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sourcingRequestData: {
      sourcingRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "SourcingRequest" },
      cropType: String,
      quantity: Number,
      unit: { type: String, default: "q" },
      targetPrice: Number,
      deliveryRegion: String,
      status: { type: String, enum: ["pending", "accepted", "rejected", "matched_listing"], default: "pending" },
    },
  },
  {
    timestamps: true,
  }
);

// Composite index for fast thread lookups (both directions)
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
