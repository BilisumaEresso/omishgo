import { z } from "zod";
import { ROLES } from "../../constants/roles.js";

// Get user-selectable roles (exclude ADMIN)
const USER_SELECTABLE_ROLES = Object.values(ROLES).filter(
  (role) => role !== ROLES.ADMIN,
);

// Validation schema for User Registration
// Note: role is NOT accepted - all new users default to FARMER (farmer-first onboarding)
export const registerValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters long"),

    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .trim()
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),

    pin: z
      .string({ required_error: "PIN is required" })
      .regex(
        /^[0-9]{4,6}$/,
        "PIN must be between 4 and 6 digits long and contain only numbers",
      ),

    phone: z
      .string({ required_error: "Phone number is required" })
      .regex(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),
  }),
});

// Validation schema for User Login
export const loginValidation = z.object({
  body: z
    .object({
      email: z
        .string()
        .email("Invalid email address")
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal("")),
      pin: z
        .string({ required_error: "PIN is required" })
        .regex(/^[0-9]{4,6}$/, "PIN must be between 4 and 6 digits"),
      phone: z
        .string()
        .regex(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
        .optional()
        .or(z.literal(""))
        .transform((value) => (value === "" ? undefined : value)),
    })
    .refine((data) => data.email || data.phone, {
      message: "Either email or phone is required",
      path: ["email"],
    }),
});
