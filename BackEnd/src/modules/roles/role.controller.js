import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import * as roleService from "./role.service.js";

/**
 * Role Controller Layer
 * Handles HTTP requests and responses, delegates business logic to service layer
 */

/**
 * GET /api/v1/roles/my-roles
 * Get authenticated user's roles and active role
 * @param {Object} req - Express request object (with user from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getMyRoles = asyncHandler(async (req, res, next) => {
  const data = await roleService.getUserRoles(req.user.sub);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User roles retrieved successfully",
    data,
  });
});

/**
 * POST /api/v1/roles/request-role
 * Request a new role for the authenticated user
 * @param {Object} req - Express request object (with user from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requestRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  const data = await roleService.requestRole(req.user.sub, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: data.message,
    data: {
      role: data.role,
      roles: data.roles,
    },
  });
});

/**
 * POST /api/v1/roles/switch-role
 * Switch the authenticated user's active role
 * @param {Object} req - Express request object (with user from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const switchRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  const user = await roleService.switchRole(req.user.sub, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role switched successfully",
    data: {
      user,
    },
  });
});
