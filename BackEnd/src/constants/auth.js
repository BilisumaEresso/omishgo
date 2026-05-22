/**
 * Auth Module Constants
 * Centralized configuration for authentication logic
 */

// PIN hashing
export const BCRYPT_ROUNDS = 10;

// JWT Token configuration
export const JWT_ALGORITHM = "HS256";
export const DEFAULT_TOKEN_EXPIRY = "24h";
export const TOKEN_ISSUER = "omishgo-backend";
export const TOKEN_AUDIENCE = "omishgo-app";

// PIN requirements
export const PIN_MIN_LENGTH = 4;
export const PIN_MAX_LENGTH = 6;
export const PIN_REGEX = /^[0-9]{4,6}$/;

// Phone number validation
export const PHONE_MIN_LENGTH = 10;
export const PHONE_MAX_LENGTH = 15;
export const PHONE_REGEX = /^[0-9]{10,15}$/;

// Name validation
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Invalid email address",
  PHONE_REQUIRED: "Phone number is required",
  PHONE_INVALID: "Phone number must be 10-15 digits",
  PIN_REQUIRED: "PIN is required",
  PIN_INVALID: `PIN must be between ${PIN_MIN_LENGTH} and ${PIN_MAX_LENGTH} digits and contain only numbers`,
  NAME_REQUIRED: "Name is required",
  NAME_TOO_SHORT: `Name must be at least ${NAME_MIN_LENGTH} characters long`,
  ROLE_REQUIRED: "Role is required",
  ROLE_INVALID: "Invalid role",
  EMAIL_EXISTS: "Email already exists",
  PHONE_EXISTS: "Phone already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid credentials",
  EMAIL_OR_PHONE_REQUIRED: "Either email or phone is required",
  USER_REGISTERED_SUCCESS: "User registered successfully",
  USER_LOGIN_SUCCESS: "User logged in successfully",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "User logged in successfully",
};
