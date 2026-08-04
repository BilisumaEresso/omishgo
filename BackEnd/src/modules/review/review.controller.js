import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import Order from "../order/order.model.js";
import User from "../user/user.model.js";
import Review from "./review.model.js";
import { createNotification } from "../notification/notification.model.js";

/**
 * @desc    Create a review for a delivered order
 * @route   POST /api/v1/reviews
 * @access  Private (Buyer)
 */
export const createReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;

  const numericRating = Number(rating);
  if (!orderId || !numericRating || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "orderId and a valid rating (1-5) are required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // A review can only be created for an order where status is "delivered"
  if (order.status !== "delivered") {
    throw new ApiError(
      400,
      `Reviews can only be created for delivered orders (current status: '${order.status}')`,
    );
  }

  // Only the order's actual buyer can leave a review
  if (order.buyerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the buyer of this order can leave a review");
  }

  // Check if a review already exists for this orderId
  const existingReview = await Review.findOne({ orderId: order._id });
  if (existingReview) {
    throw new ApiError(400, "A review has already been submitted for this order");
  }

  // Create the review for the order's actual farmerId
  const review = await Review.create({
    orderId: order._id,
    reviewerId: req.user._id,
    revieweeId: order.farmerId,
    rating: numericRating,
    comment: comment || "",
  });

  // Recompute and update the reviewee's averageRating and ratingCount
  const reviewee = await User.findById(order.farmerId);
  if (reviewee) {
    const oldAverage = reviewee.averageRating || 0;
    const oldCount = reviewee.ratingCount || 0;
    const newCount = oldCount + 1;
    const newAverage = Math.round(((oldAverage * oldCount) + numericRating) / newCount * 100) / 100;

    reviewee.averageRating = newAverage;
    reviewee.ratingCount = newCount;
    await reviewee.save();
  }

  createNotification(
    order.farmerId,
    "review_received",
    `You received a ${numericRating}-star review on your order.`,
    review._id,
    "notifications.reviewReceived",
    { rating: numericRating }
  );

  const populatedReview = await Review.findById(review._id).populate(
    "reviewerId",
    "name",
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Review created successfully",
    data: { review: populatedReview },
  });
});

/**
 * @desc    Get paginated reviews for a user by customId
 * @route   GET /api/v1/reviews/user/:customId
 * @access  Public
 */
export const getReviewsForUser = asyncHandler(async (req, res) => {
  const { customId } = req.params;

  const user = await User.findOne({ customId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ revieweeId: user._id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("reviewerId", "name"),
    Review.countDocuments({ revieweeId: user._id }),
  ]);

  const formattedReviews = reviews.map((r) => ({
    id: r._id,
    reviewerName: r.reviewerId?.name || "Anonymous",
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  }));

  return sendResponse(res, {
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: {
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    },
  });
});
