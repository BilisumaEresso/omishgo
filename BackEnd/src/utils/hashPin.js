import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

/**
 * Hashes a numeric PIN using bcrypt.
 * @param {string} pin - The plain text PIN to hash.
 * @returns {Promise<string>} The hashed PIN.
 * @throws {Error} If PIN is not a string or hashing fails.
 */
const hashPin = async (pin) => {
  if (!pin || typeof pin !== "string") {
    throw new Error("PIN must be a non-empty string");
  }

  try {
    const hashed = await bcrypt.hash(pin, BCRYPT_ROUNDS);
    return hashed;
  } catch (error) {
    throw new Error(`PIN hashing failed: ${error.message}`);
  }
};

export default hashPin;
