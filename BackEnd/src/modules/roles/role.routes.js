import express from "express";
import isAuth from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  getMyRoles,
  requestRole,
  switchRole,
} from "./role.controller.js";
import {
  requestRoleValidation,
  switchRoleValidation,
} from "./role.validation.js";

const router = express.Router();

// All role routes require authentication
router.use(isAuth);

router.get("/my-roles", getMyRoles);
router.post("/request-role", validate(requestRoleValidation), requestRole);
router.post("/switch-role", validate(switchRoleValidation), switchRole);

export default router;
