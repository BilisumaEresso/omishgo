import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
import Notification from "./notification.model.js";

/**
 * @desc    Get current user's notifications (unread first, then newest)
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    // Sort: unread (false) before read (true), then newest first
    .sort({ isRead: 1, createdAt: -1 })
    .limit(50); // Safety cap — add pagination later if needed

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return sendResponse(res, {
    statusCode: 200,
    message: "Notifications retrieved successfully",
    data: { notifications, unreadCount },
  });
});

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    // Scope to the current user so users can't mark others' notifications
    { _id: req.params.id, userId: req.user._id },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return sendResponse(res, {
    statusCode: 200,
    message: "Notification marked as read",
    data: { notification },
  });
});

/**
 * @desc    Mark ALL current user's notifications as read
 * @route   PATCH /api/v1/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "All notifications marked as read",
    data: null,
  });
});
