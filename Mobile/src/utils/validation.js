import { z } from "zod";

// --- Shared field schemas (match backend auth.validation.js exactly) ---

export const phoneSchema = z
  .string({ required_error: "Phone number is required" })
  .regex(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits");

export const pinSchema = z
  .string({ required_error: "PIN is required" })
  .regex(/^[0-9]{4,6}$/, "PIN must be between 4 and 6 digits");

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value));

export const nameSchema = z
  .string({ required_error: "Full name is required" })
  .trim()
  .min(2, "Name must be at least 2 characters");

export const roleSchema = z.enum(["buyer", "farmer", "driver", "supplier"], {
  errorMap: () => ({ message: "Please select a role" }),
});

// --- Login schema ---
export const loginSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
});

// --- Register schema ---
export const registerSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema,
    pin: pinSchema,
    confirmPin: z.string({
      required_error: "Please confirm your PIN",
    }),
    role: roleSchema,
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs do not match",
    path: ["confirmPin"],
  });

// --- Validation helpers ---

/**
 * Validate login form data using Zod.
 * Returns { isValid, errors } where errors is a map of field → message.
 */
export const validateLoginForm = (data) => {
  const result = loginSchema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }
  const errors = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0];
    if (path && !errors[path]) {
      errors[path] = err.message;
    }
  });
  return { isValid: false, errors };
};

/**
 * Validate register form data using Zod.
 * Returns { isValid, errors } where errors is a map of field → message.
 */
export const validateRegisterForm = (data) => {
  const result = registerSchema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }
  const errors = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0];
    if (path && !errors[path]) {
      errors[path] = err.message;
    }
  });
  return { isValid: false, errors };
};
