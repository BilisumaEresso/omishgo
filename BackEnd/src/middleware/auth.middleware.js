import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Protect routes - verify JWT token and attach user to req
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    req.user = await User.findById(decoded.sub || decoded.id);

    if (!req.user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    // Check if user is verified (Optional: maybe not strictly required for all routes, 
    // but good to have if MVP requires Admin approval before doing actions)
    // We will leave this to specific controllers or a separate middleware if needed.

    next();
  } catch (err) {
    let message = "Not authorized to access this route";
    if (err.name === "TokenExpiredError") {
      message = "Token expired";
    }
    return next(new ApiError(401, message));
  }
});

/**
 * Grant access to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

/**
 * Require Admin-verified account for write actions.
 * Must run after `protect` (so req.user is populated).
 * Admins are always exempt.
 */
export const requireVerified = (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (req.user.isVerified !== true) {
    return next(
      new ApiError(403, "Your account is pending Admin approval")
    );
  }
  next();
};
