import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: [
          "new_message",
          "account_approved",
          "account_rejected",
          "broadcast",
          "order_update",
          "sourcing_request",
          "sourcing_update",
          "review_received",
        ],
        message: "{VALUE} is not a valid notification type",
      },
      required: [true, "Notification type is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    messageKey: {
      type: String,
      default: null,
    },
    messageParams: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Generic reference — could be a message _id, user _id, etc.
    relatedId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

/**
 * Fire-and-forget helper — never throws so callers don't need try/catch.
 * Usage: createNotification(userId, "new_message", "You have a new message", messageId, messageKey, messageParams)
 */
export const createNotification = async (
  userId,
  type,
  message,
  relatedId = null,
  messageKey = null,
  messageParams = null
) => {
  try {
    await Notification.create({
      userId,
      type,
      message,
      relatedId: relatedId?.toString() ?? null,
      messageKey,
      messageParams,
    });
  } catch (err) {
    // Log but never bubble up — notifications are non-critical
    console.error("[Notification] Failed to create:", err.message);
  }
};

export default Notification;
