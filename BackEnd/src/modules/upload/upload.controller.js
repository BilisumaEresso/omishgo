import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";

/**
 * Pipe an in-memory file buffer to Cloudinary and resolve with the result.
 */
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "omishgo/products",
        // Cap dimensions server-side so a full-res phone photo doesn't
        // eat a farmer's data plan or the buyer's load time on 3G.
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
  if (!req.file) {
    throw new ApiError(400, "No image file provided (field name: 'image')");
  }

  const result = await streamUpload(req.file.buffer);

  return sendResponse(res, {
    statusCode: 201,
    message: "Image uploaded successfully",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});
