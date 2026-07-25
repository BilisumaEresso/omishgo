import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  getUsers,
  getUserDetail,
  approveUser,
  rejectUser,
  getAllProducts,
  approveProduct,
  rejectProduct,
  getProductDetail,
  getAllOrders,
  getOrderDetail,
  getAnalytics,
  getAuditLogs,
  broadcastAnnouncement
} from "./admin.controller.js";

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Analytics & Audit
router.get("/analytics", getAnalytics);
router.get("/audit-logs", getAuditLogs);
router.post("/broadcast", broadcastAnnouncement);

// User approvals & details
router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.put("/users/:id/approve", approveUser);
router.put("/users/:id/reject", rejectUser);

// Product approvals
router.get("/products", getAllProducts);
router.get("/products/:id", getProductDetail);
router.put("/products/:id/approve", approveProduct);
router.put("/products/:id/reject", rejectProduct);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderDetail);

export default router;
