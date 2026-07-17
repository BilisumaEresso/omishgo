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
      wereda: { type: String, required: true },
    },
    preferredLang: {
      type: String,
      enum: ["en", "am", "om"],
      default: "am",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true, // Dev mode: auto-verified. Set to false to require Admin approval in production.
    },
    rating:{
      type: Number,
      default: 3.1,
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function () {
  if (this.email === "") {
    this.email = undefined;
  }
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.phone) {
    this.phone = this.phone.trim();
  }
});

const User = mongoose.model("User", userSchema);

export default User;
