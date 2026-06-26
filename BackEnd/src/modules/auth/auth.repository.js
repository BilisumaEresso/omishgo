import User from "../user/user.model.js";

/**
 * Find user by phone
 * @param {string} phone - The phone number to search for
 * @returns {Promise<Object|null>} User document with pinHash included
 */
export const findByPhone = async (phone) => {
  return await User.findOne({ phone }).select("+pinHash");
};

/**
 * Find user by email
 * @param {string} email - The email to search for
 * @returns {Promise<Object|null>} User document or null if not found
 */
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Create a new user
 * @param {Object} userData - User data object
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
 * Check if phone exists
 * @param {string} phone - Phone to check
 * @returns {Promise<boolean>} True if phone exists
 */
export const phoneExists = async (phone) => {
  return !!(await User.findOne({ phone }));
};

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
export const emailExists = async (email) => {
  return !!(await User.findOne({ email }));
};
