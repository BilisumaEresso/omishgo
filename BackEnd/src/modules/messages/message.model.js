import mongoose from "mongoose";

const sourcingRequestSchema = new mongoose.Schema(
  {
    sourcingRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "SourcingRequest" },
    cropType: String,
    quantity: Number,
    unit: { type: String, default: "q" },
    targetPrice: Number,
    deliveryRegion: String,
    status: { type: String, enum: ["pending", "accepted", "rejected", "matched_listing"], default: "pending" },
  },
  { _id: false }
);

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
      type: sourcingRequestSchema,
      default: undefined,
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
