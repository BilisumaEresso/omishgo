import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { authLimiter } from "../../middleware/rateLimiter.middleware.js";
import {
  getMe,
  login,
  logout,
  register,
  updateLanguage,
} from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, validate(registerValidation), register);
router.post("/login", authLimiter, validate(loginValidation), login);

// Protected routes
router.use(protect);
router.get("/me", getMe);
router.patch("/me/language", updateLanguage);
router.post("/logout", logout);

export default router;
