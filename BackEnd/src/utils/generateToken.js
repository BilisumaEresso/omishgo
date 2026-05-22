// src/utils/generateToken.js
import jwt from "jsonwebtoken";

/**
 * Generates a signed JSON Web Token containing the user's ID and role.
 * Includes standard JWT claims (sub, iat, aud, iss) for security best practices.
 *
 * @param {string} id - The MongoDB user ID.
 * @param {string} role - The role assigned to the user (e.g., buyer, farmer).
 * @returns {string} The signed JWT string.
 */
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET environment variable is not defined. Cannot generate tokens.",
    );
  }

  const payload = {
    sub: id, // subject (user ID)
    role,
    iss: "omishgo-backend", // issuer
    aud: "omishgo-app", // audience
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    algorithm: "HS256",
  });
};

export const generateRefreshToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET environment variable is not defined. Cannot generate tokens.",
    );
  }

  const payload = {
    sub: id,
    role,
    type: "refresh",
    iss: "omishgo-backend",
    aud: "omishgo-app",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
    algorithm: "HS256",
  });
};

export default generateToken;
