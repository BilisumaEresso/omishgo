import mongoose from "mongoose";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import Notification from "../notification/notification.model.js";
import User from "../user/user.model.js";
import Message from "./message.model.js";

/**
 * @desc    Get thread between current user and another user
 * @route   GET /api/v1/messages/thread/:userId
 * @access  Private
 */
export const getThread = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const other = req.params.userId;

  // Validate the other user exists
  const otherUser = await User.findById(other).select("name phone");
  if (!otherUser) {
    throw new ApiError(404, "User not found");
  }

  // Fetch all messages in both directions, oldest first
  const messages = await Message.find({
    $or: [
      { senderId: me, receiverId: other },
      { senderId: other, receiverId: me },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("senderId", "name phone")
    .populate("receiverId", "name phone");

  // Mark any unread messages sent TO current user as read
  await Message.updateMany(
    { senderId: other, receiverId: me, isRead: false },
    { $set: { isRead: true } },
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Thread retrieved successfully",
    data: { messages, with: otherUser },
  });
});

/**
 * @desc    Send a message
 * @route   POST /api/v1/messages
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content?.trim()) {
    throw new ApiError(400, "receiverId and content are required");
  }

  // Cannot message yourself
  if (receiverId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot send a message to yourself");
  }

  // Validate receiver exists
  const receiver = await User.findById(receiverId).select("name phone");
  if (!receiver) {
    throw new ApiError(404, "Receiver not found");
  }

  const message = await Message.create({
    senderId: req.user._id,
    receiverId,
    content: content.trim(),
  });

  // Populate for immediate use in the UI
  await message.populate("senderId", "name phone");
  await message.populate("receiverId", "name phone");

  // Trigger notification for recipient
  try {
    await Notification.create({
      userId: receiverId,
      type: "new_message",
      message: "You have a new message",
      relatedId: message._id.toString(),
      isRead: false,
    });
  } catch (_) {}

  return sendResponse(res, {
    statusCode: 201,
    message: "Message sent",
    data: { message },
  });
});

/**
 * @desc    Get all unique conversation partners with their last message
 * @route   GET /api/v1/messages/conversations
 * @access  Private
 */
export const getConversations = asyncHandler(async (req, res) => {
  const me = req.user._id;

  // Aggregate: find the most recent message for each unique conversation partner
  const conversations = await Message.aggregate([
    // Match all messages involving the current user
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(me) },
          { receiverId: new mongoose.Types.ObjectId(me) },
        ],
      },
    },
    // Compute the "partner" ID (the other person in the conversation)
    {
      $addFields: {
        partner: {
          $cond: [
            { $eq: ["$senderId", new mongoose.Types.ObjectId(me)] },
            "$receiverId",
            "$senderId",
          ],
        },
      },
    },
    // Sort newest first so $first picks the latest message per partner
    { $sort: { createdAt: -1 } },
    // Group by partner, keeping the latest message details
    {
      $group: {
        _id: "$partner",
        lastMessage: { $first: "$content" },
        lastMessageAt: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", new mongoose.Types.ObjectId(me)] },
                  { $eq: ["$isRead", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    // Sort conversations by most recent first
    { $sort: { lastMessageAt: -1 } },
    // Populate partner user details
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "partnerInfo",
      },
    },
    { $unwind: "$partnerInfo" },
    // Shape the final output
    {
      $project: {
        _id: 0,
        partnerId: "$_id",
        partnerName: "$partnerInfo.name",
        partnerPhone: "$partnerInfo.phone",
        lastMessage: 1,
        lastMessageAt: 1,
        unreadCount: 1,
      },
    },
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: "Conversations retrieved successfully",
    data: { conversations },
  });
});
