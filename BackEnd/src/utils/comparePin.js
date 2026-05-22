import bcrypt from "bcryptjs";

/**
 * Compares a plain text PIN with a hashed PIN.
 * @param {string} pin - The plain text PIN to compare.
 * @param {string} hashedPin - The hashed PIN to compare against.
 * @returns {Promise<boolean>} True if PINs match, false otherwise.
 * @throws {Error} If comparison fails.
 */
const compare = async (pin, hashedPin) => {
  if (!pin || typeof pin !== "string") {
    throw new Error("PIN must be a non-empty string");
  }

  if (!hashedPin || typeof hashedPin !== "string") {
    throw new Error("Hashed PIN must be a non-empty string");
  }

  try {
    return await bcrypt.compare(pin, hashedPin);
  } catch (error) {
    throw new Error(`PIN comparison failed: ${error.message}`);
  }
};

export default compare;
