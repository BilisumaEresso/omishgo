import express from "express";
import { ROLES } from "../../constants/roles.js";
import { authorize, protect } from "../../middleware/auth.middleware.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import Product from "../product/product.model.js";
import Saved from "./saved.model.js";

const router = express.Router();
router.use(protect, authorize(ROLES.BUYER));

// GET /api/v1/saved — list buyer's saved products
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const saved = await Saved.find({ buyerId: req.user._id })
      .populate(
        "productId",
        "cropType quantity unit price photos location farmerId status",
      )
      .sort("-createdAt");
    const products = saved.filter((s) => s.productId).map((s) => s.productId);
    return sendResponse(res, {
      statusCode: 200,
      message: "Saved listings",
      data: { products, count: products.length },
    });
  }),
);

// POST /api/v1/saved/:productId — save a product
router.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) throw new ApiError(404, "Product not found");
    await Saved.findOneAndUpdate(
      { buyerId: req.user._id, productId: req.params.productId },
      { buyerId: req.user._id, productId: req.params.productId },
      { upsert: true, new: true },
    );
    return sendResponse(res, { statusCode: 200, message: "Product saved" });
  }),
);

// DELETE /api/v1/saved/:productId — unsave
router.delete(
  "/:productId",
  asyncHandler(async (req, res) => {
    await Saved.findOneAndDelete({
      buyerId: req.user._id,
      productId: req.params.productId,
    });
    return sendResponse(res, { statusCode: 200, message: "Product unsaved" });
  }),
);

export default router;
