import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { sendMessage, getThread } from "./chat.controller.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

router.post("/", sendMessage);
router.get("/:userId", getThread);

export default router;
