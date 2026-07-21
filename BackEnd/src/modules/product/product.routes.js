import express from "express";
import { ROLES } from "../../constants/roles.js";
import { authorize, protect, requireVerified } from "../../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getFarmerAnalytics,
  getMarketPrice,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.controller.js";

const router = express.Router();

// ─── Public routes (no auth required) ────────────────────────────────────────
router.get("/", getProducts);
router.get("/market-price", getMarketPrice);

// ─── Protected routes ─────────────────────────────────────────────────────────
// GET — farmer analytics (must come before /:id route)
router.get("/analytics", protect, authorize(ROLES.FARMER), getFarmerAnalytics);

router.get("/:id", getProductById);

// ─── Protected routes ─────────────────────────────────────────────────────────
// POST — farmer creates a listing
router.post("/", protect, authorize(ROLES.FARMER), requireVerified, createProduct);

// PUT — farmer updates their own listing
router.put("/:id", protect, authorize(ROLES.FARMER), requireVerified, updateProduct);

// DELETE — farmer deletes their own listing
router.delete("/:id", protect, authorize(ROLES.FARMER), requireVerified, deleteProduct);

export default router;
