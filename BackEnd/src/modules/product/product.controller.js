import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
import Product from "./product.model.js";

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Farmer only)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, unit, quantity, region, images } = req.body;

  if (!title || price === undefined) {
    throw new ApiError(400, "Title and price are required");
  }

  const product = await Product.create({
    farmerId: req.user._id,
    title,
    description,
    price,
    unit,
    quantity,
    region,
    images: images || [],
    status: "pending", // Default to pending approval
  });

  sendResponse(res, 201, "Product created successfully and is pending approval", { product });
});

/**
 * @desc    Get all active products with filters
 * @route   GET /api/products
 * @access  Private (Buyer or Admin)
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { region, minPrice, maxPrice, status } = req.query;

  // Build filter query
  const query = {};

  // If normal user, only see approved products. Admin can override.
  if (req.user.role === "admin" && status) {
    query.status = status;
  } else if (req.user.role !== "admin") {
    query.status = "approved"; // Buyers only see approved by default
  }

  if (region) query.region = region;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query)
    .populate("farmerId", "name phone location") // Populate farmer details
    .sort("-createdAt");

  sendResponse(res, 200, "Products retrieved successfully", { products });
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Farmer Owner only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check ownership
  if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to update this product");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  sendResponse(res, 200, "Product updated successfully", { product: updatedProduct });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Farmer Owner or Admin)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check ownership or admin
  if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to delete this product");
  }

  await product.deleteOne();

  sendResponse(res, 200, "Product deleted successfully");
});
