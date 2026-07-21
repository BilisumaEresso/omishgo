// cloudinary.js
import { v2 as cloudinary } from "cloudinary";

/**
 * Validate that required Cloudinary environment variables are set.
 * Mirrors the pattern used in config/mongoDb.js.
 */
const validateEnvironment = () => {
  const requiredEnvVars = {
    CLOUDINARY_CLOUD_NAME: "Cloudinary cloud name",
    CLOUDINARY_API_KEY: "Cloudinary API key",
    CLOUDINARY_API_SECRET: "Cloudinary API secret",
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key]) => !process.env[key])
    .map(([key, description]) => `${key} (${description})`);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join("\n")}\n\nPlease set these variables in your .env file.`,
    );
  }
};

// Only validate + configure once, and skip entirely in test env so the
// rest of the test suite (which never hits the upload route) doesn't
// need real Cloudinary credentials.
if (process.env.NODE_ENV !== "test") {
  validateEnvironment();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
