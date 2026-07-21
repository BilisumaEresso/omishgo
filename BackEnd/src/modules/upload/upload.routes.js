import express from "express";
import { ROLES } from "../../constants/roles.js";
import { authorize, protect, requireVerified } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import { uploadImage } from "./upload.controller.js";

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

export default router;
