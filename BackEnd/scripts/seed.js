// scripts/seed.js
//
// Seeds one or two Admin (Farmers' Union) accounts so the pilot never
// starts with zero working admins — see the MVP doc's "Admin is a single
// point of failure" risk (Section 11): it explicitly calls for a primary
// + backup Admin account before the pilot begins.
//
// Usage:
//   node scripts/seed.js
//
// Configure via env vars (in .env, see .env.example):
//   SEED_ADMIN_NAME, SEED_ADMIN_PHONE, SEED_ADMIN_PIN
//   SEED_ADMIN2_NAME, SEED_ADMIN2_PHONE, SEED_ADMIN2_PIN   (optional backup)
//
// Safe to re-run: if a phone number already exists, that admin is
// skipped rather than erroring out or creating a duplicate.

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../src/config/mongoDb.js";
import { registerUser } from "../src/modules/auth/auth.service.js";
import User from "../src/modules/user/user.model.js";
import { ROLES } from "../src/constants/roles.js";

const DEFAULT_LOCATION = { region: "Oromia", zone: "East Shewa", wereda: "Meki" };

async function seedAdmin({ name, phone, pin, label }) {
  if (!phone || !pin) {
    console.log(`Skipping ${label}: SEED_${label.toUpperCase()}_PHONE / _PIN not set`);
    return;
  }

  const existing = await User.findOne({ phone });
  if (existing) {
    console.log(`${label}: ${phone} already exists (id ${existing._id}) — skipping`);
    return;
  }

  const user = await registerUser({
    name: name || "OmishGo Admin",
    phone,
    pin,
    role: ROLES.ADMIN,
    location: DEFAULT_LOCATION,
    preferredLang: "en",
  });

  // Admin accounts don't need Union approval — verify immediately.
  await User.findByIdAndUpdate(user.id, { isVerified: true });
  console.log(`${label}: created ${phone} (id ${user.id})`);
}

async function run() {
  await connectDB();

  await seedAdmin({
    name: process.env.SEED_ADMIN_NAME,
    phone: process.env.SEED_ADMIN_PHONE,
    pin: process.env.SEED_ADMIN_PIN,
    label: "Admin",
  });

  await seedAdmin({
    name: process.env.SEED_ADMIN2_NAME,
    phone: process.env.SEED_ADMIN2_PHONE,
    pin: process.env.SEED_ADMIN2_PIN,
    label: "Admin2",
  });

  await mongoose.connection.close();
  console.log("Done.");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
