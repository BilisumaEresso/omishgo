import express from "express";
import { ROLES } from "../../constants/roles.js";
import { authorize, protect, requireVerified } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import { uploadImage, uploadAvatar, removeAvatar } from "./upload.controller.js";

const router = express.Router();

// POST /api/v1/upload/image — Farmer (verified) uploads a listing photo.
// Field name must be "image". Returns { url, publicId }.
router.post(
  "/image",
  protect,
  authorize(ROLES.FARMER),
  requireVerified,
  upload.single("image"),
  uploadImage,
);

// POST /api/v1/upload/avatar — Farmer or Buyer (verified) uploads a profile avatar.
router.post(
  "/avatar",
  protect,
  authorize(ROLES.FARMER, ROLES.BUYER),
  requireVerified,
  upload.single("avatar"),
  uploadAvatar,
);

// DELETE /api/v1/upload/avatar — Farmer or Buyer (verified) removes profile avatar.
router.delete(
  "/avatar",
  protect,
  authorize(ROLES.FARMER, ROLES.BUYER),
  requireVerified,
  removeAvatar,
);

export default router;

