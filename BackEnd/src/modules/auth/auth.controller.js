import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import generateToken from "../../utils/generateToken.js";
import sendResponse from "../../utils/sendResponse.js";
import User from "../user/user.model.js";
import * as authService from "./auth.service.js";

/**
 * Auth Controller Layer
 * Handles HTTP requests and responses, delegates business logic to service layer
 */

/**
 * POST /api/v1/auth/register
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, pin } = req.body;

  // All new users register as FARMER (farmer-first onboarding)
  const user = await authService.registerUser({
    name,
    phone,
    pin,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

/**
 * POST /api/v1/auth/login
 * Login a user and return JWT token
 * Enforces single-device login by checking deviceId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, phone, pin, deviceId } = req.body;

  const result = await authService.loginUser({
    phone,
    pin,
    deviceId,
  });

  // Check if login requires device move
  if (!result.token && result.requiresAction === "MOVE_DEVICE") {
    // Return error response that prompts client to initiate device move
    return sendResponse(res, {
      statusCode: 423,
      success: false,
      message: result.message,
      data: {
        code: result.code,
        requiresAction: result.requiresAction,
      },
    });
  }

  // Normal login success
  const { user, token } = result;

  // Include activeRole and roles in response for multi-role support
  const loginResponseUser = {
    id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role, // backward compatibility
    activeRole: user.activeRole,
    roles: user.roles,
    profileImage: user.profileImage,
  };
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: {
      user: loginResponseUser,
      token,
    },
  });
});

/**
 * GET /api/v1/auth/me
 * Get authenticated user profile
 * @param {Object} req - Express request object (with user from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.sub);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Return full role information for frontend
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activeRole: user.activeRole,
        roles: user.roles,
        profileImage: user.profileImage,
      },
    },
  });
});

/**
 * POST /api/v1/auth/request-device-move
 * Request device move - Generate and send OTP to user phone
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requestDeviceMove = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  const result = await authService.requestDeviceMove({ phone });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: {
      message: "OTP sent to your phone number",
    },
  });
});

/**
 * POST /api/v1/auth/confirm-device-move
 * Confirm device move - Verify OTP and switch device
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const confirmDeviceMove = asyncHandler(async (req, res, next) => {
  const { phone, otp, deviceId } = req.body;

  const { user, token } = await authService.confirmDeviceMove({
    phone,
    otp,
    deviceId,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Device moved successfully. You are now logged in.",
    data: {
      user,
      token,
    },
  });
});

/**
 * POST /api/v1/auth/refresh-token
 * Refresh access token using a refresh token
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== "refresh") {
      throw new ApiError(401, "Invalid token type");
    }

    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.isBlocked) {
      throw new ApiError(403, "User account is blocked");
    }

    const token = generateToken(user._id, user.role);

    // Refresh response now includes activeRole and roles
    const refreshedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      activeRole: user.activeRole,
      roles: user.roles,
      profileImage: user.profileImage,
    };
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Token refreshed successfully",
      data: {
        token,
        refreshToken,
        user: refreshedUser,
      },
    });
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Invalid or expired refresh token",
    );
  }
});
