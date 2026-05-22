// user.model.js
import mongoose from "mongoose";
import { ROLES } from "../../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    pin: {
      type: String,
      required: [true, "PIN is required"],
      minlength: [4, "PIN must be at least 4 digits long"],
      select: false, // Hidden from queries by default
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: Object.values(ROLES),
        message: "{VALUE} is not a valid role",
      },
      default: "farmer",
    },
    roles: [
      {
        type: {
          type: String,
          enum: {
            values: Object.values(ROLES).filter((role) => role !== ROLES.ADMIN),
            message: "{VALUE} is not a valid role for users",
          },
          required: true,
        },
        status: {
          type: String,
          enum: {
            values: ["active", "pending", "blocked"],
            message: "{VALUE} is not a valid role status",
          },
          default: "active",
        },
        subscription: {
          tier: { type: String, default: "free_trial" },
          startsAt: { type: Date },
          expiresAt: { type: Date },
          isActive: { type: Boolean, default: false },
        },
      },
    ],
    activeRole: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: "{VALUE} is not a valid role",
      },
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    activeDeviceId: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save hook: Normalize user data and initialize multi-role support
 * Ensures email is lowercase and phone is trimmed
 * Auto-initializes roles array from existing role field for backward compatibility
 * Blocks admin role from user selection
 */
userSchema.pre("save", function () {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.phone) {
    this.phone = this.phone.trim();
  }

  // Block admin role selection
  if (this.role === ROLES.ADMIN) {
    throw new Error("Admin role cannot be assigned to users directly");
  }

  // Auto-initialize roles array from existing role field if roles is empty
  if (this.role && (!this.roles || this.roles.length === 0)) {
    this.roles = [
      {
        type: this.role,
        status: "active",
        subscriptionTier: "free",
      },
    ];
  }

  // Initialize activeRole from role if not set
  if (this.role && !this.activeRole) {
    this.activeRole = this.role;
  }
});

const User = mongoose.model("User", userSchema);

export default User;
