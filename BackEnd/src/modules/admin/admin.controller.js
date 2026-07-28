import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
import User from "../user/user.model.js";
import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import AuditLog, { logAction } from "./auditLog.model.js";
import { createNotification } from "../notification/notification.model.js";

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
 * @desc    Get user detail (profile, listings, orders)
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const getUserDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { customId: id };

  const user = await User.findOne(query);
  if (!user) throw new ApiError(404, "User not found");

  const products = await Product.find({ farmerId: user._id }).sort("-createdAt");
  const orders = await Order.find({
    $or: [{ buyerId: user._id }, { farmerId: user._id }]
  }).populate("productId", "cropType price unit customId").sort("-createdAt");

  sendResponse(res, {
    statusCode: 200,
    message: "User detail retrieved",
    data: { user, products, orders }
  });
});

/**
 * @desc    Approve a user
 * @route   PUT /api/admin/users/:id/approve
 * @access  Private (Admin only)
 */
export const approveUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { customId: id };

  const user = await User.findOneAndUpdate(
    query,
    { isVerified: true },
    { new: true }
  );

  if (!user) throw new ApiError(404, "User not found");

  await logAction(req.user._id, "approve_user", user._id, "User");

  sendResponse(res, { statusCode: 200, message: "User approved successfully", data: { user } });
});

/**
 * @desc    Reject/Block a user
 * @route   PUT /api/admin/users/:id/reject
 * @access  Private (Admin only)
 */
export const rejectUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { customId: id };

  const user = await User.findOneAndUpdate(
    query,
    { isVerified: false }, // Simplest rejection for MVP
    { new: true }
  );

  if (!user) throw new ApiError(404, "User not found");

  await logAction(req.user._id, "reject_user", user._id, "User");

  sendResponse(res, { statusCode: 200, message: "User rejected successfully", data: { user } });
});

/**
 * @desc    Get all products (with optional filters) and flag price anomalies
 * @route   GET /api/admin/products
 * @access  Private (Admin only)
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { status, cropType } = req.query;
  const query = {};

  if (status) query.status = status;
  if (cropType) query.cropType = { $regex: cropType, $options: "i" };

  let products = await Product.find(query)
    .populate("farmerId", "name phone location customId")
    .sort("-createdAt");
    
  // Calculate market averages for anomaly detection
  const averages = await Product.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: { $toLower: "$cropType" }, avgPrice: { $avg: "$price" } } }
  ]);
  
  const avgMap = {};
  averages.forEach(a => avgMap[a._id] = a.avgPrice);

  // Add anomaly flags
  const productsWithFlags = products.map(p => {
    const pObj = p.toObject();
    const avg = avgMap[p.cropType.toLowerCase()];
    if (avg) {
      if (p.price > avg * 2) pObj.priceAnomaly = "high";
      else if (p.price < avg * 0.5) pObj.priceAnomaly = "low";
    }
    return pObj;
  });

  sendResponse(res, { statusCode: 200, message: "Products retrieved", data: { products: productsWithFlags } });
});

/**
 * @desc    Get product detail
 * @route   GET /api/admin/products/:id
 * @access  Private (Admin only)
 */
export const getProductDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { customId: id };

  const product = await Product.findOne(query)
    .populate("farmerId", "name phone location role customId");
    
  if (!product) throw new ApiError(404, "Product not found");

  // Get recent orders for this product
  const orders = await Order.find({ productId: product._id })
    .populate("buyerId", "name phone customId")
    .sort("-createdAt")
    .limit(10);

  sendResponse(res, {
    statusCode: 200,
    message: "Product detail retrieved",
    data: { product, orders }
  });
});

/**
 * @desc    Get all orders (with optional filters)
 * @route   GET /api/admin/orders
 * @access  Private (Admin only)
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};

  if (status) query.status = status;

  const orders = await Order.find(query)
    .populate("buyerId", "name phone customId")
    .populate("farmerId", "name phone customId")
    .populate("productId", "cropType price unit photos customId")
    .sort("-createdAt");

  sendResponse(res, { statusCode: 200, message: "Orders retrieved", data: { orders } });
});

/**
 * @desc    Get order detail
 * @route   GET /api/admin/orders/:id
 * @access  Private (Admin only)
 */
export const getOrderDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { customId: id };

  const order = await Order.findOne(query)
    .populate("buyerId", "name phone location customId")
    .populate("farmerId", "name phone location customId")
    .populate("productId", "cropType price unit photos description customId");
    
  if (!order) throw new ApiError(404, "Order not found");

  sendResponse(res, {
    statusCode: 200,
    message: "Order detail retrieved",
    data: { order }
  });
});



/**
 * @desc    Get analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin only)
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  // Registration trends (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const registrations = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { 
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
        }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);

  // Trade volume by crop
  const tradeVolume = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: "$cropType", revenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
    { $sort: { revenue: -1 } }
  ]);

  // Regional performance (using User locations)
  const regionalPerformance = await User.aggregate([
    { $match: { "location.region": { $exists: true, $ne: "" } } },
    { $group: { _id: "$location.region", count: { $sum: 1 } } }
  ]);

  sendResponse(res, { 
    statusCode: 200, 
    message: "Analytics retrieved", 
    data: { 
      registrations, 
      tradeVolume, 
      regionalPerformance 
    } 
  });
});

/**
 * @desc    Get audit logs
 * @route   GET /api/admin/audit-logs
 * @access  Private (Admin only)
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("adminId", "name phone")
    .populate("targetId", "customId name") // Polymorphic populate using refPath
    .sort("-createdAt")
    .limit(100);

  sendResponse(res, { statusCode: 200, message: "Logs retrieved", data: { logs } });
});

/**
 * @desc    Send broadcast announcement
 * @route   POST /api/admin/broadcast
 * @access  Private (Admin only)
 */
export const broadcastAnnouncement = asyncHandler(async (req, res) => {
  const { message, targetRole, targetUser } = req.body;
  if (!message) throw new ApiError(400, "Message is required");

  let users = [];

  if (targetRole === "specific") {
    if (!targetUser) throw new ApiError(400, "Target user ID is required when sending to a specific user");
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(targetUser);
    const query = isObjectId ? { _id: targetUser } : { customId: targetUser };
    const user = await User.findOne(query).select("_id");
    if (!user) throw new ApiError(404, "User not found");
    users = [user];
  } else {
    const query = {};
    if (targetRole && targetRole !== "all") query.role = targetRole;
    users = await User.find(query).select("_id");
  }
  
  // Bulk create notifications (fire and forget for now, but in reality we'd batch)
  const promises = users.map(u => createNotification(u._id, "broadcast", message));
  await Promise.allSettled(promises);

  const actionDetails = targetRole === "specific" ? `Sent to user ${targetUser}: ${message}` : `Sent to ${targetRole || "all"}: ${message}`;
  const targetId = targetRole === "specific" ? users[0]._id : null;
  const targetType = targetRole === "specific" ? "User" : "System";

  await logAction(req.user._id, "system_message", targetId, targetType, actionDetails);

  sendResponse(res, { statusCode: 200, message: `Message sent to ${users.length} user(s)`, data: null });
});
