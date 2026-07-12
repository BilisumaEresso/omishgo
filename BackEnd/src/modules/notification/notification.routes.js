import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import Notification from "./notification.model.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// GET  /api/v1/notifications           — list current user's notifications
router.get("/", getNotifications);

// PATCH /api/v1/notifications/read-all — mark all as read
// NOTE: must be declared BEFORE /:id to avoid "read-all" being matched as an id param
router.patch("/read-all", asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  return sendResponse(res, { statusCode: 200, message: "All notifications marked as read" });
}));

// PATCH /api/v1/notifications/:id/read — mark single as read
router.patch("/:id/read", markAsRead);

export default router;
