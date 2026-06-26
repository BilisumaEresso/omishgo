// auth.validation.js
import { z } from "zod";
import { ROLES } from "../../constants/roles.js";

// Validation schema for User Registration
export const registerValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name cannot be empty"),
    phone: z
      .string({ required_error: "Phone number is required" })
      .regex(/^[0-9+]{8,15}$/, "Phone must be a valid digit string"),
    pin: z
      .string({ required_error: "PIN is required" })
      .regex(/^[0-9]{4,6}$/, "PIN must be between 4 and 6 digits"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    role: z.enum([ROLES.FARMER, ROLES.BUYER]).default(ROLES.FARMER),
    location: z.object({
      region: z.string().min(1, "Region is required"),
      zone: z.string().min(1, "Zone is required"),
      kebele: z.string().min(1, "Kebele is required"),
    }),
    preferredLang: z.enum(["en", "am", "om"]).default("am"),
  }),
});

// Validation schema for User Login
export const loginValidation = z.object({
  body: z.object({
    phone: z
      .string({ required_error: "Phone number is required" })
      .regex(/^[0-9+]{8,15}$/, "Phone must be a valid digit string"),
    pin: z
      .string({ required_error: "PIN is required" })
      .regex(/^[0-9]{4,6}$/, "PIN must be between 4 and 6 digits"),
    deviceId: z.string().optional(),
  }),
});
