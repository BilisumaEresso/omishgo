import { z } from "zod";
import { ROLES } from "../../constants/roles.js";

// Requestable roles — exclude ADMIN and FARMER
const REQUESTABLE_ROLES = Object.values(ROLES).filter(
  (role) => role !== ROLES.ADMIN && role !== ROLES.FARMER,
);

// Switchable roles — exclude ADMIN
const SWITCHABLE_ROLES = Object.values(ROLES).filter(
  (role) => role !== ROLES.ADMIN,
);

/**
 * Validation schema for POST /request-role
 */
export const requestRoleValidation = z.object({
  body: z.object({
    role: z
      .string({ required_error: "Role is required" })
      .trim()
      .toLowerCase()
      .refine((val) => Object.values(ROLES).includes(val), {
        message: "Invalid role",
      }),
  }),
});

/**
 * Validation schema for POST /switch-role
 */
export const switchRoleValidation = z.object({
  body: z.object({
    role: z
      .string({ required_error: "Role is required" })
      .trim()
      .toLowerCase()
      .refine((val) => SWITCHABLE_ROLES.includes(val), {
        message: "Invalid role",
      }),
  }),
});
