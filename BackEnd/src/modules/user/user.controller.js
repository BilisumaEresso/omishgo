import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import User from "./user.model.js";
import Order from "../order/order.model.js";

/**
 * @desc    Get user/farmer by ID
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sendResponse(res, {
    statusCode: 200,
    message: "User fetched successfully",
    data: { user },
  });
});

/**
 * @desc    Get recent activities (orders, etc.) for the current user
 * @route   GET /api/v1/users/me/activities
 * @access  Private
 */
export const getMyActivities = asyncHandler(async (req, res) => {
  // Fetch the last 5 orders placed by the user
  const orders = await Order.find({ buyerId: req.user._id })
    .sort("-createdAt")
    .limit(5)
    .populate("productId", "cropType price unit")
    .populate("farmerId", "name");

  // Map to the "Activity" format expected by the frontend
  const activities = orders.map((order) => {
    return {
      id: order._id.toString(),
      type: "order",
      title: `Order: ${order.cropType}`,
      description: `Ordered ${order.quantity} ${order.unit} from ${order.farmerId?.name || "Farmer"} - Status: ${order.status}`,
      time: order.createdAt, // Frontend handles relative time
      _raw: order,
    };
  });

  return sendResponse(res, {
    statusCode: 200,
    message: "Recent activities",
    data: { activities },
  });
});
