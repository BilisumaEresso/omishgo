import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import Order from "../order/order.model.js";
import Product from "./product.model.js";

/**
 * @desc    Get all active listings (public)
 * @route   GET /api/v1/products
 * @access  Public
 * @query   ?cropType=Teff&region=Oromia&farmerId=<farmer_id>
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { cropType, region, farmerId } = req.query;

  // If farmerId is provided, show all statuses; otherwise show only active
  const query = {};
  if (farmerId) {
    query.farmerId = farmerId;
  } else {
    query.status = "active";
  }

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
    "name phone location",
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
  const {
    cropType,
    quantity,
    unit,
    price,
    description,
    photos,
    location,
    status,
  } = req.body;

  if (!cropType || price === undefined || quantity === undefined) {
    throw new ApiError(400, "cropType, price, and quantity are required");
  }

  const product = await Product.create({
    farmerId: req.user._id,
    cropType,
    quantity,
    unit, // defaults to "kg" in schema
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
    { new: true, runValidators: true },
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

/**
 * @desc    Get average market price for a crop type
 * @route   GET /api/v1/products/market-price?cropType=Teff
 * @access  Public
 */
export const getMarketPrice = asyncHandler(async (req, res) => {
  const { cropType } = req.query;
  if (!cropType) throw new ApiError(400, "cropType is required");

  const results = await Product.aggregate([
    {
      $match: {
        status: "active",
        cropType: { $regex: cropType, $options: "i" },
      },
    },
    {
      $group: {
        _id: "$cropType",
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        count: { $sum: 1 },
      },
    },
  ]);

  const data = results[0] || {
    avgPrice: null,
    minPrice: null,
    maxPrice: null,
    count: 0,
  };

  return sendResponse(res, {
    statusCode: 200,
    message: "Market price retrieved",
    data: { cropType, ...data },
  });
});

/**
 * @desc    Get aggregated analytics for a farmer
 * @route   GET /api/v1/products/analytics
 * @access  Private (Farmer)
 */
export const getFarmerAnalytics = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;

  // Total products
  const totalProducts = await Product.countDocuments({
    farmerId,
    status: "active",
  });

  // Order stats
  const orderStats = await Order.aggregate([
    { $match: { farmerId: farmerId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  const stats = {
    pending: 0,
    confirmed: 0,
    in_transit: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    totalOrders: 0,
  };
  orderStats.forEach((s) => {
    stats[s._id] = s.count;
    stats.totalOrders += s.count;
    if (s._id === "delivered") stats.totalRevenue += s.revenue;
  });

  // Top crops by order count
  const topCrops = await Order.aggregate([
    { $match: { farmerId: farmerId } },
    {
      $group: {
        _id: "$cropType",
        orders: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { orders: -1 } },
    { $limit: 5 },
  ]);

  // Recent 30 days revenue by week
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const weeklyRevenue = await Order.aggregate([
    {
      $match: {
        farmerId: farmerId,
        status: "delivered",
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $week: "$createdAt" },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: "Analytics retrieved",
    data: { totalProducts, ...stats, topCrops, weeklyRevenue },
  });
});
