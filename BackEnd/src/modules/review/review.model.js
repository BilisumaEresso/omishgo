import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order ID is required"],
      unique: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer ID is required"],
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewee ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ revieweeId: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
