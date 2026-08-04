import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { getMyActivities, getUserById, getPublicProfileByCustomId } from "./user.controller.js";

const router = express.Router();

// Public route (unauthenticated)
router.get("/public/:customId", getPublicProfileByCustomId);

// Require auth for remaining user routes
router.use(protect);

router.get("/me/activities", getMyActivities);
router.get("/:id", getUserById);

export default router;

