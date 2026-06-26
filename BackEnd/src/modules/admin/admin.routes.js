import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  getUsers,
  approveUser,
  rejectUser,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} from "./admin.controller.js";

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

// User approvals
router.get("/users", getUsers);
router.put("/users/:id/approve", approveUser);
router.put("/users/:id/reject", rejectUser);

// Product approvals
router.get("/products", getPendingProducts);
router.put("/products/:id/approve", approveProduct);
router.put("/products/:id/reject", rejectProduct);

export default router;
