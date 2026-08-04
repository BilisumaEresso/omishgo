import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import User from "../user/user.model.js";

/**
 * Pipe an in-memory file buffer to Cloudinary and resolve with the result.
 */
const streamUpload = (buffer, folder = "omishgo/products") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        // Cap dimensions server-side so a full-res phone photo doesn't
        // eat a user's data plan or load time on 3G.
        transformation: [
          { width: 1280, height: 1280, crop: "limit" },
          { quality: "auto:good" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * @desc    Upload a single product photo to Cloudinary
 * @route   POST /api/v1/upload/image
 * @access  Private (Farmer, verified)
 */
export const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file || (req.files && (req.files.image?.[0] || req.files.avatar?.[0]));
  if (!file) {
    throw new ApiError(400, "No image file provided (field name: 'image')");
  }

  const result = await streamUpload(file.buffer, "omishgo/products");

  return sendResponse(res, {
    statusCode: 201,
    message: "Image uploaded successfully",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});

/**
 * @desc    Upload profile avatar to Cloudinary and save to User model
 * @route   POST /api/v1/upload/avatar
 * @access  Private (Farmer or Buyer, verified)
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  const file = req.file || (req.files && (req.files.avatar?.[0] || req.files.image?.[0]));
  if (!file) {
    throw new ApiError(400, "No avatar image file provided (field name: 'avatar' or 'image')");
  }

  const result = await streamUpload(file.buffer, "omishgo/avatars");

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: result.secure_url },
    { new: true },
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Avatar uploaded successfully",
    data: {
      avatarUrl: result.secure_url,
      user: updatedUser,
    },
  });
});

/**
 * @desc    Remove profile avatar from User model
 * @route   DELETE /api/v1/upload/avatar
 * @access  Private (Farmer or Buyer, verified)
 */
export const removeAvatar = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { avatarUrl: null });

  return sendResponse(res, {
    statusCode: 200,
    message: "Avatar removed successfully",
    data: {
      avatarUrl: null,
    },
  });
});

