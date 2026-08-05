import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import Notification, { createNotification } from "../src/modules/notification/notification.model.js";
import Order from "../src/modules/order/order.model.js";
import Product from "../src/modules/product/product.model.js";
import SourcingRequest from "../src/modules/sourcing/sourcing.model.js";
import User from "../src/modules/user/user.model.js";
import generateToken from "../src/utils/generateToken.js";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omishgo_test"
    );
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

let counter = 300;

describe("Notification Localization & Triggers", () => {
  let adminToken, farmerToken, buyerToken;
  let adminId, farmerId, buyerId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await SourcingRequest.deleteMany({});
    await Notification.deleteMany({});

    counter += 1;
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash("1234", salt);

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      phone: `096${counter}0000`,
      pinHash,
      role: "admin",
      location: { region: "Oromia", zone: "East Shewa", wereda: "Meki" },
      isVerified: true,
    });
    adminId = admin._id;
    adminToken = generateToken(admin._id.toString(), "admin");

    // Create Farmer
    const farmer = await User.create({
      name: "Test Farmer",
      phone: `096${counter}0001`,
      pinHash,
      role: "farmer",
      location: { region: "Oromia", zone: "East Shewa", wereda: "Meki" },
      isVerified: true,
    });
    farmerId = farmer._id;
    farmerToken = generateToken(farmer._id.toString(), "farmer");

    // Create Buyer
    const buyer = await User.create({
      name: "Test Buyer",
      phone: `096${counter}0002`,
      pinHash,
      role: "buyer",
      location: { region: "Addis Ababa", zone: "Addis Ababa", wereda: "Bole" },
      isVerified: true,
    });
    buyerId = buyer._id;
    buyerToken = generateToken(buyer._id.toString(), "buyer");
  });

  test("1. createNotification stores messageKey and messageParams", async () => {
    await createNotification(
      farmerId,
      "order_update",
      "Your order for Teff has been confirmed.",
      "12345",
      "notifications.orderConfirmed",
      { cropType: "Teff" }
    );

    const notif = await Notification.findOne({ userId: farmerId });
    expect(notif).toBeDefined();
    expect(notif.type).toBe("order_update");
    expect(notif.message).toBe("Your order for Teff has been confirmed.");
    expect(notif.messageKey).toBe("notifications.orderConfirmed");
    expect(notif.messageParams).toEqual({ cropType: "Teff" });
  });

  test("2. Send message creates new_message notification for receiver with key & params", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ receiverId: farmerId.toString(), content: "Hello farmer!" });
    expect(res.status).toBe(201);

    const notif = await Notification.findOne({ userId: farmerId });
    expect(notif).toBeDefined();
    expect(notif.type).toBe("new_message");
    expect(notif.messageKey).toBe("notifications.newMessageFrom");
    expect(notif.messageParams).toEqual({ senderName: "Test Buyer", senderId: buyerId.toString() });
  });

  test("3. Admin approve/reject user triggers account_approved / account_rejected notification", async () => {
    // Approve
    const approveRes = await request(app)
      .put(`/api/v1/admin/users/${farmerId}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(approveRes.status).toBe(200);

    let notif = await Notification.findOne({ userId: farmerId, type: "account_approved" });
    expect(notif).toBeDefined();
    expect(notif.messageKey).toBe("notifications.accountApprovedMsg");
    expect(notif.messageParams).toBeNull();

    // Reject
    const rejectRes = await request(app)
      .put(`/api/v1/admin/users/${farmerId}/reject`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(rejectRes.status).toBe(200);

    notif = await Notification.findOne({ userId: farmerId, type: "account_rejected" });
    expect(notif).toBeDefined();
    expect(notif.messageKey).toBe("notifications.accountRejectedMsg");
    expect(notif.messageParams).toBeNull();
  });

  test("4. Sourcing request response triggers sourcing_update notification for buyer", async () => {
    const sourcingRes = await request(app)
      .post("/api/v1/sourcing/request")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({
        cropType: "Red Onion",
        quantity: 50,
        unit: "q",
        targetPrice: 2400,
        deliveryRegion: "Addis Ababa",
      });

    expect(sourcingRes.status).toBe(201);
    const requestId = sourcingRes.body.data.request._id;

    // Farmer responds accepted
    const respondRes = await request(app)
      .post(`/api/v1/sourcing/requests/${requestId}/respond`)
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ action: "accepted" });
    expect(respondRes.status).toBe(200);

    const notif = await Notification.findOne({ userId: buyerId, type: "sourcing_update" });
    expect(notif).toBeDefined();
    expect(notif.messageKey).toBe("notifications.sourcingAccepted");
    expect(notif.messageParams).toEqual({ cropType: "Red Onion" });
  });

  test("5. Order status change triggers order_update notification with key & params", async () => {
    const prod = await Product.create({
      farmerId,
      cropType: "Wheat",
      quantity: 100,
      unit: "q",
      price: 3000,
      location: { region: "Oromia", zone: "East Shewa", wereda: "Meki" },
    });

    const orderRes = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId: prod._id.toString(), quantity: 10 });
    expect(orderRes.status).toBe(201);

    const orderId = orderRes.body.data.order._id || orderRes.body.data.order.id;

    const statusRes = await request(app)
      .patch(`/api/v1/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ status: "confirmed" });
    expect(statusRes.status).toBe(200);

    const notif = await Notification.findOne({ userId: buyerId, type: "order_update" });
    expect(notif).toBeDefined();
    expect(notif.messageKey).toBe("notifications.orderConfirmed");
    expect(notif.messageParams).toEqual({ cropType: "Wheat" });
  });

  test("6. Review creation triggers review_received notification for farmer", async () => {
    const prod = await Product.create({
      farmerId,
      cropType: "Tomato",
      quantity: 50,
      unit: "q",
      price: 2000,
      location: { region: "Oromia", zone: "East Shewa", wereda: "Meki" },
    });

    const orderRes = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId: prod._id.toString(), quantity: 10 });
    expect(orderRes.status).toBe(201);

    const orderId = orderRes.body.data.order._id || orderRes.body.data.order.id;

    // Transition to confirmed -> in_transit -> delivered
    const s1 = await request(app).patch(`/api/v1/orders/${orderId}/status`).set("Authorization", `Bearer ${farmerToken}`).send({ status: "confirmed" });
    expect(s1.status).toBe(200);
    const s2 = await request(app).patch(`/api/v1/orders/${orderId}/status`).set("Authorization", `Bearer ${farmerToken}`).send({ status: "in_transit" });
    expect(s2.status).toBe(200);
    const s3 = await request(app).patch(`/api/v1/orders/${orderId}/status`).set("Authorization", `Bearer ${farmerToken}`).send({ status: "delivered" });
    expect(s3.status).toBe(200);

    // Submit review
    const reviewRes = await request(app)
      .post("/api/v1/reviews")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ orderId, rating: 5, comment: "Excellent tomatoes!" });
    expect(reviewRes.status).toBe(201);

    const notif = await Notification.findOne({ userId: farmerId, type: "review_received" });
    expect(notif).toBeDefined();
    expect(notif.messageKey).toBe("notifications.reviewReceived");
    expect(notif.messageParams).toEqual({ rating: 5 });
  });

  test("7. Admin broadcast keeps messageKey and messageParams as null", async () => {
    const bRes = await request(app)
      .post("/api/v1/admin/broadcast")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ message: "Important system maintenance tonight" });
    expect(bRes.status).toBe(200);

    const notif = await Notification.findOne({ type: "broadcast" });
    expect(notif).toBeDefined();
    expect(notif.message).toBe("Important system maintenance tonight");
    expect(notif.messageKey).toBeNull();
    expect(notif.messageParams).toBeNull();
  });
});
