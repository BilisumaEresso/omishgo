import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../constants/roles.js";
import * as roleRepository from "./role.repository.js";

/**
 * Role Service Layer
 * Handles all role business logic and validation
 */

/**
 * Get user's roles and active role
 *
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object>} activeRole and roles array
 * @throws {ApiError} If user not found
 */
export const getUserRoles = async (userId) => {
  const user = await roleRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    activeRole: user.activeRole,
    roles: user.roles,
  };
};

/**
 * Request a new role for the user
 *
 * Business Rules:
 * - ADMIN: always blocked (never requestable)
 * - FARMER: reject (already default role for all users)
 * - BUYER: active immediately
 * - DRIVER: active immediately (MVP)
 * - SUPPLIER: status "pending" (requires approval)
 *
 * @param {string} userId - Authenticated user ID
 * @param {string} role - Role to request
 * @returns {Promise<Object>} Updated roles data
 * @throws {ApiError} If validation fails
 */
export const requestRole = async (userId, role) => {
  // 1. Block admin role completely
  if (role === ROLES.ADMIN) {
    throw new ApiError(403, "This role cannot be requested");
  }

  // 2. Reject farmer role (already default)
  if (role === ROLES.FARMER) {
    throw new ApiError(
      400,
      "Farmer is the default role and cannot be requested again",
    );
  }

  // 3. Validate role exists in ROLES constants
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // 4. Find user
  const user = await roleRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 5. Prevent duplicate roles
  const existingRole = user.roles.find((r) => r.type === role);
  if (existingRole) {
    throw new ApiError(
      409,
      `You already have the ${role} role (status: ${existingRole.status})`,
    );
  }

  // 6. Determine role status based on business logic
  let status;
  switch (role) {
    case ROLES.BUYER:
      status = "active";
      break;
    case ROLES.DRIVER:
      status = "active";
      break;
    case ROLES.SUPPLIER:
      status = "pending";
      break;
    default:
      throw new ApiError(400, "Invalid role");
  }

  // 7. Add role to user
  const newRole = {
    type: role,
    status,
    subscriptionTier: "free",
  };

  user.roles.push(newRole);
  await roleRepository.saveUser(user);

  return {
    message:
      status === "active"
        ? `${role} role added successfully and is now active`
        : `${role} role requested successfully and is pending approval`,
    role: newRole,
    roles: user.roles,
  };
};

/**
 * Switch the user's active role
 *
 * Rules:
 * - User must own the role
 * - Role status must be "active"
 * - Admin role is always blocked
 * - Keeps user.role synced with user.activeRole for backward compatibility
 *
 * @param {string} userId - Authenticated user ID
 * @param {string} role - Role to switch to
 * @returns {Promise<Object>} Updated user data
 * @throws {ApiError} If validation fails
 */
export const switchRole = async (userId, role) => {
  // 1. Block admin role
  if (role === ROLES.ADMIN) {
    throw new ApiError(403, "Cannot switch to this role");
  }

  // 2. Validate role exists in ROLES constants
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // 3. Find user
  const user = await roleRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 4. Verify user owns the role
  const ownedRole = user.roles.find((r) => r.type === role);
  if (!ownedRole) {
    throw new ApiError(403, "You do not have this role");
  }

  // 5. Verify role status is active
  if (ownedRole.status !== "active") {
    throw new ApiError(
      403,
      `Cannot switch to ${role} role — current status is "${ownedRole.status}"`,
    );
  }

  // 6. Update activeRole
  user.activeRole = role;

  // 7. BACKWARD COMPATIBILITY: sync user.role with activeRole
  user.role = role;

  // 8. Save user
  await roleRepository.saveUser(user);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    roles: user.roles,
    activeRole: user.activeRole,
    profileImage: user.profileImage,
  };
};
