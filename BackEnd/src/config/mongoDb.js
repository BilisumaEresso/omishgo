// db.js
import mongoose from "mongoose";

/**
 * Validate that required environment variables are set
 * Throws error if critical variables are missing
 */
const validateEnvironment = () => {
  const requiredEnvVars = {
    MONGO_STR: "MongoDB connection string",
    JWT_SECRET: "JWT secret key",
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

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    // Validate environment before connecting
    validateEnvironment();

    const conn = await mongoose.connect(process.env.MONGO_STR);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
