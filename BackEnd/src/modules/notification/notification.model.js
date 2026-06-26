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
        values: ["new_message", "account_approved", "account_rejected"],
        message: "{VALUE} is not a valid notification type",
      },
      required: [true, "Notification type is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
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
 * Usage: createNotification(userId, "new_message", "You have a new message", messageId)
 */
export const createNotification = async (userId, type, message, relatedId = null) => {
  try {
    await Notification.create({ userId, type, message, relatedId: relatedId?.toString() ?? null });
  } catch (err) {
    // Log but never bubble up — notifications are non-critical
    console.error("[Notification] Failed to create:", err.message);
  }
};

export default Notification;
