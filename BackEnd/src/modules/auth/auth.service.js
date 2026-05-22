import { ROLES } from "../../constants/roles.js";
import ApiError from "../../utils/ApiError.js";
import comparePin from "../../utils/comparePin.js";
import {
  updateUserDevice,
  validateDeviceForLogin,
} from "../../utils/device.service.js";
import generateToken, {
  generateRefreshToken,
} from "../../utils/generateToken.js";
import hashPin from "../../utils/hashPin.js";
import { generateOTP, sendOTPViaSMS } from "../../utils/otp.js";
import * as authRepository from "./auth.repository.js";
import OTP from "./otp.model.js";

/**
 * Auth Service Layer
 * Handles all auth business logic and validation
 */

/**
 * Register a new user
 * Validates uniqueness of email and phone, hashes PIN, creates user
 * All new users default to FARMER role (farmer-first onboarding)
 *
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User full name
 * @param {string} userData.email - User email (must be unique)
 * @param {string} userData.phone - User phone (must be unique)
 * @param {string} userData.pin - Plain text PIN
 * @returns {Promise<Object>} Newly created user (without PIN)
 * @throws {ApiError} If email/phone already exists or other validation fails
 */
export const registerUser = async ({ name, email, phone, pin }) => {
  const normalizedEmail = email?.trim() || undefined;

  // Check if email already exists only when an email was provided
  if (normalizedEmail) {
    const emailExists = await authRepository.emailExists(normalizedEmail);
    if (emailExists) {
      throw new ApiError(409, "Email already exists", {
        email: "email already exist",
      });
    }
  }

  // Check if phone already exists
  const phoneExists = await authRepository.phoneExists(phone);
  if (phoneExists) {
    throw new ApiError(409, "Phone already exists", {
      phone: "phone already exist",
    });
  }

  // Hash the PIN
  const hashedPin = await hashPin(pin);

  // Create the user with normalized email only when provided
  // All new users default to FARMER role (farmer-first onboarding)
  const newUserData = {
    name,
    phone,
    pin: hashedPin,
    role: ROLES.FARMER,
    roles: [
      {
        type: ROLES.FARMER,
        status: "active",
        subscriptionTier: "free",
      },
    ],
    activeRole: ROLES.FARMER,
  };

  if (normalizedEmail) {
    newUserData.email = normalizedEmail;
  }

  const user = await authRepository.createUser(newUserData);

  // Return user without PIN
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    roles: user.roles,
    activeRole: user.activeRole,
  };
};

/**
 * Login a user
 * Finds user by email or phone, validates PIN, generates token
 * Enforces single-device login by checking deviceId
 *
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email (optional if phone provided)
 * @param {string} credentials.phone - User phone (optional if email provided)
 * @param {string} credentials.pin - Plain text PIN
 * @param {string} credentials.deviceId - Device identifier from mobile app
 * @returns {Promise<Object>} User data and JWT token
 * @throws {ApiError} If user not found, PIN invalid, credentials missing, or device already active
 */
export const loginUser = async ({ email, phone, pin, deviceId }) => {
  const normalizedEmail = email?.trim() || undefined;
  const normalizedPhone = phone?.trim() || undefined;

  // Validate that at least one credential is provided
  if (!normalizedEmail && !normalizedPhone) {
    throw new ApiError(400, "Email or phone is required");
  }

  // Validate that deviceId is provided
  if (!deviceId) {
    throw new ApiError(400, "Device ID is required");
  }

  // Find user by email or phone
  const user = await authRepository.findByEmailOrPhone(
    normalizedEmail,
    normalizedPhone,
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify PIN
  const pinMatch = await comparePin(pin, user.pin);
  if (!pinMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // STEP 3: DEVICE VALIDATION (with development bypass)
  const deviceValidation = validateDeviceForLogin(user, deviceId);

  if (!deviceValidation.valid) {
    // Device mismatch in production mode
    return {
      success: false,
      code: deviceValidation.code,
      requiresAction: deviceValidation.shouldMoveDevice ? "MOVE_DEVICE" : null,
      message: deviceValidation.message,
    };
  }

  // STEP 4: SUCCESS - Update device info and generate token
  // Update activeDeviceId and lastLoginAt
  updateUserDevice(user, deviceId);
  await user.save();

  // Generate JWT token
  const token = await generateToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, user.role);

  // Return user (without PIN), token, and refreshToken
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      roles: user.roles,
      activeRole: user.activeRole,
    },
    token,
    refreshToken,
  };
};

/**
 * Validate that user doesn't already exist (by email or phone)
 * Used during registration validation
 *
 * @param {string} email - Email to check
 * @param {string} phone - Phone to check
 * @returns {Promise<Object>} Contains exists flags and error details
 */
export const validateUserUniqueness = async (email, phone) => {
  const emailTaken = await authRepository.emailExists(email);
  const phoneTaken = await authRepository.phoneExists(phone);

  return {
    emailTaken,
    phoneTaken,
    errors: {
      ...(emailTaken && { email: "Email already exists" }),
      ...(phoneTaken && { phone: "Phone already exists" }),
    },
  };
};

/**
 * Request device move - Generate and send OTP to user phone
 *
 * @param {string} phone - User phone number
 * @returns {Promise<Object>} Success response
 * @throws {ApiError} If user not found or OTP send fails
 */
export const requestDeviceMove = async ({ phone }) => {
  const normalizedPhone = phone?.trim();

  if (!normalizedPhone) {
    throw new ApiError(400, "Phone number is required");
  }

  // Find user by phone
  const user = await authRepository.findByPhone(normalizedPhone);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete any existing OTP for this phone
  await OTP.deleteMany({ phone: normalizedPhone, purpose: "device_move" });

  // Generate new OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP to database
  await OTP.create({
    phone: normalizedPhone,
    otp,
    purpose: "device_move",
    expiresAt,
  });

  // Send OTP via SMS
  const sent = await sendOTPViaSMS(normalizedPhone, otp);

  if (!sent) {
    throw new ApiError(500, "Failed to send OTP");
  }

  return {
    success: true,
    message: "OTP sent to your phone",
  };
};

/**
 * Confirm device move - Verify OTP and switch device
 *
 * @param {Object} data - Confirmation data
 * @param {string} data.phone - User phone number
 * @param {string} data.otp - OTP code
 * @param {string} data.deviceId - New device ID
 * @returns {Promise<Object>} User data and JWT token
 * @throws {ApiError} If user not found, OTP invalid, expired, or too many attempts
 */
export const confirmDeviceMove = async ({ phone, otp, deviceId }) => {
  const normalizedPhone = phone?.trim();

  if (!normalizedPhone) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  if (!deviceId) {
    throw new ApiError(400, "Device ID is required");
  }

  // Find user by phone
  const user = await authRepository.findByPhone(normalizedPhone);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find valid OTP
  const otpRecord = await OTP.findOne({
    phone: normalizedPhone,
    purpose: "device_move",
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    throw new ApiError(404, "OTP expired or not found");
  }

  // Check attempt limit
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new ApiError(429, "Too many OTP attempts. Please request a new OTP");
  }

  // Verify OTP
  if (otpRecord.otp !== otp) {
    // Increment attempt count
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new ApiError(401, "Invalid OTP");
  }

  // OTP valid - delete it
  await OTP.deleteOne({ _id: otpRecord._id });

  // Update user with new device
  user.activeDeviceId = deviceId;
  user.lastLoginAt = new Date();
  await user.save();

  // Generate JWT token
  const token = await generateToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, user.role);

  // Return login success response
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
    refreshToken,
  };
};
