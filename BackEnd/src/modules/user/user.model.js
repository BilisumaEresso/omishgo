import mongoose from "mongoose";
import { ROLES } from "../../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    pinHash: {
      type: String,
      required: [true, "PIN is required"],
      select: false, // Hidden from queries by default
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: Object.values(ROLES),
        message: "{VALUE} is not a valid role",
      },
      default: ROLES.FARMER,
    },
    location: {
      region: { type: String, required: true },
      zone: { type: String, required: true },
      kebele: { type: String, required: true },
    },
    preferredLang: {
      type: String,
      enum: ["en", "am", "om"],
      default: "am",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin needs to approve
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.email === "") {
    this.email = undefined;
  }
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.phone) {
    this.phone = this.phone.trim();
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
