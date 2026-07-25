import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "../src/modules/user/user.model.js";
import Product from "../src/modules/product/product.model.js";
import Order from "../src/modules/order/order.model.js";
import { ROLES } from "../src/constants/roles.js";

const MONGODB_URI = process.env.MONGO_STR;

const generateCustomId = (prefix) => {
  return `${prefix}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
};

const backfill = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for backfill.");

    // Backfill Users
    const users = await User.find({ customId: { $exists: false } });
    console.log(`Found ${users.length} users needing customId.`);
    for (const user of users) {
      const prefix = user.role === ROLES.BUYER ? "BYR" : "FMR";
      user.customId = generateCustomId(prefix);
      await user.save({ validateBeforeSave: false }); // skip validation if any fields are invalid from old schema
    }
    console.log("Users backfilled.");

    // Backfill Products
    const products = await Product.find({ customId: { $exists: false } });
    console.log(`Found ${products.length} products needing customId.`);
    for (const product of products) {
      product.customId = generateCustomId("PRD");
      await product.save({ validateBeforeSave: false });
    }
    console.log("Products backfilled.");

    // Backfill Orders
    const orders = await Order.find({ customId: { $exists: false } });
    console.log(`Found ${orders.length} orders needing customId.`);
    for (const order of orders) {
      order.customId = generateCustomId("ORD");
      await order.save({ validateBeforeSave: false });
    }
    console.log("Orders backfilled.");

    console.log("Backfill complete!");
    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
};

backfill();
