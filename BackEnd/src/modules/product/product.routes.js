import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

// All product routes require authentication
router.use(protect);

// Farmer only routes
router.post("/", authorize(ROLES.FARMER), createProduct);

// Farmer owner can update
router.put("/:id", authorize(ROLES.FARMER), updateProduct);

// Farmer owner or admin can delete
router.delete("/:id", authorize(ROLES.FARMER, ROLES.ADMIN), deleteProduct);

// Buyer or admin can view
router.get("/", authorize(ROLES.BUYER, ROLES.ADMIN), getProducts);

export default router;
