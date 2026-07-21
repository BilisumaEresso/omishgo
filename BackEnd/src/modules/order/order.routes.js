import express from "express";
import { protect, requireVerified } from "../../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "./order.controller.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

// GET  /api/v1/orders          → get my orders (buyer or farmer)
router.get("/", getMyOrders);

// POST /api/v1/orders          → buyer places an order
router.post("/", requireVerified, createOrder);

// GET  /api/v1/orders/:id      → get a single order
router.get("/:id", getOrderById);

// PATCH /api/v1/orders/:id/status  → update order status
router.patch("/:id/status", updateOrderStatus);

export default router;
