import express from "express";
import { protect, requireVerified } from "../../middleware/auth.middleware.js";
import { getThread, sendMessage, getConversations } from "./message.controller.js";

const router = express.Router();

// All message routes require authentication
router.use(protect);

// GET /api/v1/messages/conversations — list all conversation partners
// NOTE: must be declared BEFORE /:userId to avoid "conversations" being matched as a userId param
router.get("/conversations", getConversations);

// GET /api/v1/messages/thread/:userId — full thread with a specific user
router.get("/thread/:userId", getThread);

// POST /api/v1/messages — send a message
router.post("/", requireVerified, sendMessage);

export default router;
