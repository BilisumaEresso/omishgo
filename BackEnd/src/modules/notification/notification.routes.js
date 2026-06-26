import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.controller.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// GET  /api/v1/notifications           — list current user's notifications
router.get("/", getNotifications);

// PATCH /api/v1/notifications/read-all — mark all as read
// NOTE: must be declared BEFORE /:id to avoid "read-all" being matched as an id param
router.patch("/read-all", markAllAsRead);

// PATCH /api/v1/notifications/:id/read — mark single as read
router.patch("/:id/read", markAsRead);

export default router;
