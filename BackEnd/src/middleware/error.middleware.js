import { MulterError } from "multer";
import { ZodError } from "zod";

import ApiError from "../utils/ApiError.js";
import formatZodErrors from "../utils/formatZodErrors.js";
import sendResponse from "../utils/sendResponse.js";

const errorMiddleware = (error, req, res, next) => {
  console.error("❌ ERROR:", error);

  /*
   |--------------------------------------------------------------------------
   | Zod Validation Error
   |--------------------------------------------------------------------------
   */

  if (error instanceof ZodError) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      errors: formatZodErrors(error),
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Custom API Error
   |--------------------------------------------------------------------------
   */

  if (error instanceof ApiError) {
    return sendResponse(res, {
      statusCode: error.statusCode,
      success: false,
      message: error.message,
      errors: error.errors || null,
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Multer (file upload) Error
   |--------------------------------------------------------------------------
   */

  if (error instanceof MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image is too large (max 5MB)"
        : error.code === "LIMIT_FILE_COUNT"
          ? "Too many images (max 2 per listing)"
          : "Image upload failed";

    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message,
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Mongo Duplicate Key Error
   |--------------------------------------------------------------------------
   */

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];

    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: `${field} already exists`,
    });
  }

  /*
   |--------------------------------------------------------------------------
   | JWT Errors
   |--------------------------------------------------------------------------
   */

  if (error.name === "JsonWebTokenError") {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Token expired",
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Default Unknown Error
   |--------------------------------------------------------------------------
   */

  return sendResponse(res, {
    statusCode: error.statusCode || 500,
    success: false,
    message: error.message || "Internal server error",
  });
};

export default errorMiddleware;
