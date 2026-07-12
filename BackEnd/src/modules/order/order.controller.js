import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import Product from "../product/product.model.js";
import Order from "./order.model.js";

/**
 * @desc    Create a new order (buyer places an order)
 * @route   POST /api/v1/orders
 * @access  Private (Buyer)
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { productId, quantity, note } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "productId and quantity are required");
  }

  // Fetch the product to validate it exists and is active
  const product = await Product.findById(productId).populate(
    "farmerId",
    "name phone",
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.status !== "active") {
    throw new ApiError(400, "This product is no longer available");
  }

  if (product.quantity < quantity) {
    throw new ApiError(400, `Only ${product.quantity} ${product.unit} available`);
  }

  // Prevent farmers from ordering their own product
  if (product.farmerId._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot order your own product");
  }

  const totalPrice = product.price * quantity;

  const order = await Order.create({
    buyerId: req.user._id,
    farmerId: product.farmerId._id,
    productId: product._id,
    cropType: product.cropType,
    quantity,
    unit: product.unit,
    pricePerUnit: product.price,
    totalPrice,
    note: note || "",
  });

  // Populate for the response
  const populated = await Order.findById(order._id)
    .populate("buyerId", "name phone")
    .populate("farmerId", "name phone")
    .populate("productId", "cropType price unit");

  return sendResponse(res, {
    statusCode: 201,
    message: "Order placed successfully",
    data: { order: populated },
  });
});

/**
 * @desc    Get my orders (buyer sees their purchases, farmer sees orders on their products)
 * @route   GET /api/v1/orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { status, role } = req.query;

  // Determine the query based on user role
  const isFarmer = req.user.role === "farmer";
  const query = isFarmer
    ? { farmerId: req.user._id }
    : { buyerId: req.user._id };

  if (status && status !== "all") {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate("buyerId", "name phone")
    .populate("farmerId", "name phone")
    .populate("productId", "cropType price unit photos")
    .sort("-createdAt");

  return sendResponse(res, {
    statusCode: 200,
    message: "Orders retrieved successfully",
    data: { orders, count: orders.length },
  });
});

/**
 * @desc    Get a single order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private (buyer or farmer of the order)
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyerId", "name phone")
    .populate("farmerId", "name phone")
    .populate("productId", "cropType price unit photos location");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Only the buyer or farmer involved in the order can view it
  const userId = req.user._id.toString();
  const isBuyer = order.buyerId._id.toString() === userId;
  const isFarmer = order.farmerId._id.toString() === userId;

  if (!isBuyer && !isFarmer) {
    throw new ApiError(403, "Not authorized to view this order");
  }

  return sendResponse(res, {
    statusCode: 200,
    message: "Order retrieved successfully",
    data: { order },
  });
});

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private
 *   - Farmer: pending → confirmed → in_transit → delivered
 *   - Buyer: pending → cancelled
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "New status is required");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const userId = req.user._id.toString();
  const isBuyer = order.buyerId.toString() === userId;
  const isFarmer = order.farmerId.toString() === userId;

  if (!isBuyer && !isFarmer) {
    throw new ApiError(403, "Not authorized to update this order");
  }

  // Enforce transition rules
  const FARMER_TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["in_transit", "cancelled"],
    in_transit: ["delivered"],
  };

  const BUYER_TRANSITIONS = {
    pending: ["cancelled"],
  };

  const allowed = isFarmer
    ? FARMER_TRANSITIONS[order.status] || []
    : BUYER_TRANSITIONS[order.status] || [];

  if (!allowed.includes(status)) {
    throw new ApiError(
      400,
      `Cannot transition from "${order.status}" to "${status}"`,
    );
  }

  order.status = status;
  await order.save();

  const updated = await Order.findById(order._id)
    .populate("buyerId", "name phone")
    .populate("farmerId", "name phone")
    .populate("productId", "cropType price unit");

  return sendResponse(res, {
    statusCode: 200,
    message: "Order status updated",
    data: { order: updated },
  });
});
