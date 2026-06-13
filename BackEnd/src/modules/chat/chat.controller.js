import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
import Message from "./message.model.js";
import User from "../user/user.model.js";

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, productId, text } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !text) {
    throw new ApiError(400, "Receiver ID and text are required");
  }

  // Validate receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new ApiError(404, "Receiver not found");
  }

  const message = await Message.create({
    senderId,
    receiverId,
    productId,
    text,
  });

  // Here you would typically also trigger a notification for the receiver

  sendResponse(res, 201, "Message sent", { message });
});

/**
 * @desc    Get conversation thread with a specific user
 * @route   GET /api/messages/:userId
 * @access  Private
 */
export const getThread = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const otherUserId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId },
    ],
  }).sort({ createdAt: 1 }); // Oldest first for chat UI

  // Mark unread messages from the other user as read
  await Message.updateMany(
    { senderId: otherUserId, receiverId: currentUserId, read: false },
    { $set: { read: true } }
  );

  sendResponse(res, 200, "Thread retrieved", { messages });
});
