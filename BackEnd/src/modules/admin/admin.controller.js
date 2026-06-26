import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
import User from "../user/user.model.js";
import Product from "../product/product.model.js";

/**
 * @desc    Get all users (with optional filters)
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { isVerified, role } = req.query;
  const query = {};

  if (isVerified !== undefined) query.isVerified = isVerified === "true";
  if (role) query.role = role;

  const users = await User.find(query).sort("-createdAt");

  sendResponse(res, { statusCode: 200, message: "Users retrieved", data: { users } });
});

/**
 * @desc    Approve a user
 * @route   PUT /api/admin/users/:id/approve
 * @access  Private (Admin only)
 */
export const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );

  if (!user) throw new ApiError(404, "User not found");

  sendResponse(res, { statusCode: 200, message: "User approved successfully", data: { user } });
});

/**
 * @desc    Reject/Block a user
 * @route   PUT /api/admin/users/:id/reject
 * @access  Private (Admin only)
 */
export const rejectUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: false }, // Simplest rejection for MVP
    { new: true }
  );

  if (!user) throw new ApiError(404, "User not found");

  sendResponse(res, { statusCode: 200, message: "User rejected successfully", data: { user } });
});

/**
 * @desc    Get pending products
 * @route   GET /api/admin/products
 * @access  Private (Admin only)
 */
export const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: "pending" })
    .populate("farmerId", "name phone location")
    .sort("createdAt");

  sendResponse(res, { statusCode: 200, message: "Pending products retrieved", data: { products } });
});

/**
 * @desc    Approve a product
 * @route   PUT /api/admin/products/:id/approve
 * @access  Private (Admin only)
 */
export const approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  if (!product) throw new ApiError(404, "Product not found");

  sendResponse(res, { statusCode: 200, message: "Product approved successfully", data: { product } });
});

/**
 * @desc    Reject a product
 * @route   PUT /api/admin/products/:id/reject
 * @access  Private (Admin only)
 */
export const rejectProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  if (!product) throw new ApiError(404, "Product not found");

  sendResponse(res, { statusCode: 200, message: "Product rejected successfully", data: { product } });
});
