import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication routes (login/register).
 * Protects against brute-force guessing of short numeric PINs.
 */
export const authLimiter = process.env.NODE_ENV === "test" 
  ? (req, res, next) => next() 
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many attempts, please try again later",
      },
    });
