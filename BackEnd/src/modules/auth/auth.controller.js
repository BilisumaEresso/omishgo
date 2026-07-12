import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import User from "../user/user.model.js";
import * as authService from "./auth.service.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: { user },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data,
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires JWT)
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    phone: req.user.phone,
    role: req.user.role,
    location: req.user.location,
    preferredLang: req.user.preferredLang,
    isVerified: req.user.isVerified,
  };

  sendResponse(res, {
    statusCode: 200,
    message: "User profile retrieved successfully",
    data: { user },
  });
});

export const updateLanguage = asyncHandler(async (req, res) => {
  const { preferredLang } = req.body;
  const allowed = ["en", "am", "om"];
  if (!preferredLang || !allowed.includes(preferredLang)) {
    throw new ApiError(400, "preferredLang must be en, am, or om");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { preferredLang },
    { new: true },
  ).select("-password");

  return sendResponse(res, {
    statusCode: 200,
    message: "Language updated",
    data: { user },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private (Requires JWT)
 */
export const logout = asyncHandler(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });
});
