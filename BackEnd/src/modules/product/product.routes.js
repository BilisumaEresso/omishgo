import express from "express";
import { ROLES } from "../../constants/roles.js";
import { authorize, protect } from "../../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getMarketPrice,
  getProductById,
  getProducts,
  updateProduct,
} from "./product.controller.js";

const router = express.Router();

// ─── Public routes (no auth required) ────────────────────────────────────────
router.get("/", getProducts);
router.get("/market-price", getMarketPrice);
router.get("/:id", getProductById);

// ─── Protected routes ─────────────────────────────────────────────────────────
// POST — farmer creates a listing
router.post("/", protect, authorize(ROLES.FARMER), createProduct);

// PUT — farmer updates their own listing
router.put("/:id", protect, authorize(ROLES.FARMER), updateProduct);

// DELETE — farmer deletes their own listing
router.delete("/:id", protect, authorize(ROLES.FARMER), deleteProduct);

export default router;
