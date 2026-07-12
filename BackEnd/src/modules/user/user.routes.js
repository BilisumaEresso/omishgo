import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { getMyActivities, getUserById } from "./user.controller.js";

const router = express.Router();

// Require auth for all user routes
router.use(protect);

router.get("/me/activities", getMyActivities);
router.get("/:id", getUserById);

export default router;
