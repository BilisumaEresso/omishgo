import express from "express";
import isAuth from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  confirmDeviceMove,
  getMe,
  login,
  refreshToken,
  register,
  requestDeviceMove,
} from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/request-device-move", requestDeviceMove);
router.post("/confirm-device-move", confirmDeviceMove);
router.post("/refresh-token", refreshToken);
router.get("/me", isAuth, getMe);

export default router;
