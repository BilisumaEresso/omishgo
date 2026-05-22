import User from "../user/user.model.js";

/**
 * Role Repository Layer
 * Handles all role-related data access operations
 */

/**
 * Find user by ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} User document or null
 */
export const findUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Save user document
 * @param {Object} user - Mongoose user document
 * @returns {Promise<Object>} Saved user document
 */
export const saveUser = async (user) => {
  return await user.save();
};
