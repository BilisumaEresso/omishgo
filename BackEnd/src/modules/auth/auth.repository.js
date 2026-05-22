import User from "../user/user.model.js";

/**
 * Auth Repository Layer
 * Handles all User data access operations
 */

/**
 * Find user by email
 * @param {string} email - The email to search for
 * @returns {Promise<Object|null>} User document or null if not found
 */
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Find user by phone
 * @param {string} phone - The phone number to search for
 * @returns {Promise<Object|null>} User document or null if not found
 */
export const findByPhone = async (phone) => {
  return await User.findOne({ phone });
};

/**
 * Find user by email or phone
 * Attempts email first, then phone
 * @param {string} email - Email to search for
 * @param {string} phone - Phone to search for
 * @returns {Promise<Object|null>} User document with pin field or null if not found
 */
export const findByEmailOrPhone = async (email, phone) => {
  let user = null;
  if (email) {
    user = await User.findOne({ email }).select("+pin");
  } else if (phone) {
    user = await User.findOne({ phone }).select("+pin");
  }
  return user;
};

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.phone - User phone
 * @param {string} userData.pin - Hashed PIN
 * @param {string} userData.role - User role
 * @returns {Promise<Object>} Created user document
 */
export const createUser = async (userData) => {
  if (!userData.email) {
    delete userData.email;
  }

  const user = new User(userData);
  await user.save();
  return user;
};

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
export const emailExists = async (email) => {
  return !!(await User.findOne({ email }));
};

/**
 * Check if phone exists
 * @param {string} phone - Phone to check
 * @returns {Promise<boolean>} True if phone exists
 */
export const phoneExists = async (phone) => {
  return !!(await User.findOne({ phone }));
};
