// Backend/src/modules/sourcing/sourcing.routes.js
import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  createSourcingRequest,
  getSourcingRequests,
  respondToSourcingRequest,
} from "./sourcing.controller.js";

const router = express.Router();

router.post("/request", protect, createSourcingRequest);
router.get("/requests", protect, getSourcingRequests);
router.post("/requests/:id/respond", protect, respondToSourcingRequest);

export default router;
