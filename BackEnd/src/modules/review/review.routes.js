import express from "express";
import { ROLES } from "../../constants/roles.js";
import { authorize, protect, requireVerified } from "../../middleware/auth.middleware.js";
import { createReview, getReviewsForUser } from "./review.controller.js";

const router = express.Router();

// GET /api/v1/reviews/user/:customId — Public paginated reviews for user
router.get("/user/:customId", getReviewsForUser);

// POST /api/v1/reviews — Protected (Buyer only, verified)
router.post(
  "/",
  protect,
  authorize(ROLES.BUYER),
  requireVerified,
  createReview,
);

export default router;
