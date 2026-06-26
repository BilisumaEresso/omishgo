// auth.service.js
import bcrypt from "bcryptjs";
import { ROLES } from "../../constants/roles.js";
import ApiError from "../../utils/ApiError.js";
import generateToken from "../../utils/generateToken.js";
import * as authRepository from "./auth.repository.js";

/**
 * Register a new user
 */
export const registerUser = async ({
  name,
  phone,
  pin,
  email,
  role,
  location,
  preferredLang,
}) => {
  const normalizedPhone = phone.trim();
  const normalizedEmail = email?.trim() || undefined;

  // Check phone exists
  if (await authRepository.phoneExists(normalizedPhone)) {
    throw new ApiError(409, "Phone number already exists", {
      phone: "already exists",
    });
  }

  // Check email exists
  if (normalizedEmail && (await authRepository.emailExists(normalizedEmail))) {
    throw new ApiError(409, "Email already exists", {
      email: "already exists",
    });
  }

  // Hash PIN
  const salt = await bcrypt.genSalt(10);
  const pinHash = await bcrypt.hash(pin, salt);

  // Use input role, fallback to FARMER
  const finalRole = role || ROLES.FARMER;

  // Create User
  const newUserData = {
    name,
    phone: normalizedPhone,
    pinHash,
    role: finalRole,
    location,
    preferredLang,
    email: normalizedEmail,
  };

  const user = await authRepository.createUser(newUserData);

  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    location: user.location,
    preferredLang: user.preferredLang,
    isVerified: user.isVerified,
  };
};

/**
 * Login a user
 */
export const loginUser = async ({ phone, pin }) => {
  const normalizedPhone = phone.trim();

  // Find user by phone
  const user = await authRepository.findByPhone(normalizedPhone);
  if (!user || !user.pinHash) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Verify PIN
  const isMatch = await bcrypt.compare(pin, user.pinHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate JWT token
  const token = await generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      location: user.location,
      preferredLang: user.preferredLang,
      isVerified: user.isVerified,
    },
    token,
  };
};
