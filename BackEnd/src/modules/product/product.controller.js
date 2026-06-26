import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
import Product from "./product.model.js";

/**
 * @desc    Get all active listings (public)
 * @route   GET /api/v1/products
 * @access  Public
 * @query   ?cropType=Teff&region=Oromia
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { cropType, region } = req.query;

  // Public endpoint: only return active listings
  const query = { status: "active" };

  if (cropType) {
    // Case-insensitive partial match on cropType
    query.cropType = { $regex: cropType, $options: "i" };
  }
  if (region) {
    query["location.region"] = { $regex: region, $options: "i" };
  }

  const products = await Product.find(query)
    .populate("farmerId", "name phone location")
    .sort("-createdAt");

  return sendResponse(res, {
    statusCode: 200,
    message: "Products retrieved successfully",
    data: { products, count: products.length },
  });
});

/**
 * @desc    Get a single listing by ID (public)
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "farmerId",
    "name phone location"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return sendResponse(res, {
    statusCode: 200,
    message: "Product retrieved successfully",
    data: { product },
  });
});

/**
 * @desc    Create a new product listing
 * @route   POST /api/v1/products
 * @access  Private (Farmer only)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { cropType, quantity, unit, price, description, photos, location, status } = req.body;

  if (!cropType || price === undefined || quantity === undefined) {
    throw new ApiError(400, "cropType, price, and quantity are required");
  }

  const product = await Product.create({
    farmerId: req.user._id,
    cropType,
    quantity,
    unit,           // defaults to "kg" in schema
    price,
    description,
    photos: photos || [],
    location: location || {},
    status: status || "active",
  });

  return sendResponse(res, {
    statusCode: 201,
    message: "Product listing created successfully",
    data: { product },
  });
});

/**
 * @desc    Update a product listing
 * @route   PUT /api/v1/products/:id
 * @access  Private (Farmer — own listing only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Ownership check — only the farmer who created it can update
  if (product.farmerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this product");
  }

  // Prevent farmerId from being overwritten via body
  delete req.body.farmerId;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate("farmerId", "name phone location");

  return sendResponse(res, {
    statusCode: 200,
    message: "Product updated successfully",
    data: { product: updatedProduct },
  });
});

/**
 * @desc    Delete a product listing
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Farmer — own listing only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Ownership check — only the farmer who created it can delete
  if (product.farmerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this product");
  }

  await product.deleteOne();

  return sendResponse(res, {
    statusCode: 200,
    message: "Product deleted successfully",
    data: null,
  });
});
