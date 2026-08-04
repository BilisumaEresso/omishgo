import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/modules/user/user.model.js";
import Product from "../src/modules/product/product.model.js";
import Order from "../src/modules/order/order.model.js";
import Review from "../src/modules/review/review.model.js";

process.env.JWT_SECRET = "testsecret";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omishgo_test",
    );
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Review.deleteMany({});
});

describe("Public Profile, Avatar & Review System", () => {
  const farmerData = {
    name: "Abebe Farmer",
    phone: "0911111111",
    pin: "1234",
    role: "farmer",
    location: { region: "Oromia", zone: "Jimma", wereda: "Seka" },
    preferredLang: "am",
  };

  const buyerData = {
    name: "Kebede Buyer",
    phone: "0922222222",
    pin: "1234",
    role: "buyer",
    location: { region: "Addis Ababa", zone: "Bole", wereda: "Wereda 01" },
    preferredLang: "en",
  };

  const otherBuyerData = {
    name: "Chala Buyer",
    phone: "0933333333",
    pin: "1234",
    role: "buyer",
    location: { region: "Oromia", zone: "Ambo", wereda: "Center" },
    preferredLang: "om",
  };

  async function registerAndLogin(userData) {
    const regRes = await request(app).post("/api/v1/auth/register").send(userData);
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: userData.phone, pin: userData.pin });
    // Approve user directly in DB
    await User.findOneAndUpdate({ phone: userData.phone }, { isVerified: true });
    const user = await User.findOne({ phone: userData.phone });
    return { token: loginRes.body.data.token, user };
  }

  describe("STEP 1 & 2: User Avatar Endpoints", () => {
    it("should allow uploading and deleting avatar", async () => {
      const { token, user } = await registerAndLogin(buyerData);

      // Delete avatar endpoint
      const delRes = await request(app)
        .delete("/api/v1/upload/avatar")
        .set("Authorization", `Bearer ${token}`);

      expect(delRes.status).toBe(200);
      expect(delRes.body.data.avatarUrl).toBeNull();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.avatarUrl).toBeNull();
    });
  });

  describe("STEP 3: Public Profile Lookup", () => {
    it("should return 404 for non-existent customId", async () => {
      const res = await request(app).get("/api/v1/users/public/FMR-NONEXISTENT");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    it("should return ONLY whitelisted fields for public profile", async () => {
      const { user: farmer } = await registerAndLogin(farmerData);

      // Create an active product for farmer
      await Product.create({
        farmerId: farmer._id,
        cropType: "Teff",
        quantity: 500,
        unit: "kg",
        price: 80,
        status: "active",
      });

      // Create a delivered order for farmer
      await Order.create({
        buyerId: new mongoose.Types.ObjectId(),
        farmerId: farmer._id,
        productId: new mongoose.Types.ObjectId(),
        cropType: "Teff",
        quantity: 10,
        unit: "kg",
        pricePerUnit: 80,
        totalPrice: 800,
        status: "delivered",
      });

      const res = await request(app).get(`/api/v1/users/public/${farmer.customId}`);

      expect(res.status).toBe(200);
      const profile = res.body.data.user;

      // Whitelisted fields check
      expect(profile).toHaveProperty("name", "Abebe Farmer");
      expect(profile).toHaveProperty("role", "farmer");
      expect(profile).toHaveProperty("customId", farmer.customId);
      expect(profile).toHaveProperty("avatarUrl", null);
      expect(profile).toHaveProperty("isVerified", true);
      expect(profile).toHaveProperty("location");
      expect(profile.location).toEqual({ region: "Oromia", zone: "Jimma" });
      expect(profile).toHaveProperty("createdAt");
      expect(profile).toHaveProperty("averageRating", 0);
      expect(profile).toHaveProperty("ratingCount", 0);
      expect(profile).toHaveProperty("activeListingsCount", 1);
      expect(profile).toHaveProperty("completedOrdersCount", 1);

      // Strict privacy check: confirm sensitive or unlisted fields are NOT exposed
      const profileKeys = Object.keys(profile);
      const allowedKeys = [
        "name",
        "role",
        "customId",
        "avatarUrl",
        "isVerified",
        "location",
        "createdAt",
        "averageRating",
        "ratingCount",
        "activeListingsCount",
        "completedOrdersCount",
      ];
      expect(profileKeys.sort()).toEqual(allowedKeys.sort());

      // Confirm subfields of location only contain region and zone
      expect(Object.keys(profile.location).sort()).toEqual(["region", "zone"]);

      // Confirm sensitive fields are explicitly undefined
      expect(profile.phone).toBeUndefined();
      expect(profile.email).toBeUndefined();
      expect(profile.pinHash).toBeUndefined();
      expect(profile.wereda).toBeUndefined();
      expect(profile._id).toBeUndefined();
    });
  });

  describe("STEP 4: Review and Rating Endpoints", () => {
    let farmer, buyer, otherBuyer, product, pendingOrder, deliveredOrder1, deliveredOrder2, deliveredOrder3;

    beforeEach(async () => {
      const fRes = await registerAndLogin(farmerData);
      farmer = fRes.user;

      const bRes = await registerAndLogin(buyerData);
      buyer = bRes;

      const obRes = await registerAndLogin(otherBuyerData);
      otherBuyer = obRes;

      product = await Product.create({
        farmerId: farmer._id,
        cropType: "Maize",
        quantity: 1000,
        unit: "kg",
        price: 30,
        status: "active",
      });

      pendingOrder = await Order.create({
        buyerId: buyer.user._id,
        farmerId: farmer._id,
        productId: product._id,
        cropType: "Maize",
        quantity: 10,
        unit: "kg",
        pricePerUnit: 30,
        totalPrice: 300,
        status: "pending",
      });

      deliveredOrder1 = await Order.create({
        buyerId: buyer.user._id,
        farmerId: farmer._id,
        productId: product._id,
        cropType: "Maize",
        quantity: 20,
        unit: "kg",
        pricePerUnit: 30,
        totalPrice: 600,
        status: "delivered",
      });

      deliveredOrder2 = await Order.create({
        buyerId: buyer.user._id,
        farmerId: farmer._id,
        productId: product._id,
        cropType: "Maize",
        quantity: 15,
        unit: "kg",
        pricePerUnit: 30,
        totalPrice: 450,
        status: "delivered",
      });

      deliveredOrder3 = await Order.create({
        buyerId: buyer.user._id,
        farmerId: farmer._id,
        productId: product._id,
        cropType: "Maize",
        quantity: 25,
        unit: "kg",
        pricePerUnit: 30,
        totalPrice: 750,
        status: "delivered",
      });
    });

    it("should reject review creation for non-delivered order", async () => {
      const res = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: pendingOrder._id,
          rating: 5,
          comment: "Great service",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/delivered/i);
    });

    it("should reject review creation by user who is not the actual buyer", async () => {
      const res = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${otherBuyer.token}`)
        .send({
          orderId: deliveredOrder1._id,
          rating: 5,
          comment: "Trying to review someone else's order",
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/buyer/i);
    });

    it("should reject duplicate review for the same orderId", async () => {
      // First review succeeds
      const firstRes = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder1._id,
          rating: 5,
          comment: "Excellent teff!",
        });
      expect(firstRes.status).toBe(201);

      // Second review for same order fails
      const secondRes = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder1._id,
          rating: 4,
          comment: "Second review attempt",
        });
      expect(secondRes.status).toBe(400);
      expect(secondRes.body.message).toMatch(/already/i);
    });

    it("should correctly update averageRating and ratingCount across multiple reviews", async () => {
      // Review 1: Rating = 5
      // Initial state: averageRating = 0, ratingCount = 0
      // Math: ((0 * 0) + 5) / 1 = 5
      const res1 = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder1._id,
          rating: 5,
          comment: "Top quality",
        });
      expect(res1.status).toBe(201);

      let updatedFarmer = await User.findById(farmer._id);
      expect(updatedFarmer.averageRating).toBe(5);
      expect(updatedFarmer.ratingCount).toBe(1);

      // Review 2: Rating = 3
      // Math: ((5 * 1) + 3) / 2 = 4
      const res2 = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder2._id,
          rating: 3,
          comment: "Average batch",
        });
      expect(res2.status).toBe(201);

      updatedFarmer = await User.findById(farmer._id);
      expect(updatedFarmer.averageRating).toBe(4);
      expect(updatedFarmer.ratingCount).toBe(2);

      // Review 3: Rating = 4
      // Math: ((4 * 2) + 4) / 3 = 4
      const res3 = await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder3._id,
          rating: 4,
          comment: "Good delivery",
        });
      expect(res3.status).toBe(201);

      updatedFarmer = await User.findById(farmer._id);
      expect(updatedFarmer.averageRating).toBe(4);
      expect(updatedFarmer.ratingCount).toBe(3);

      // Verify public profile reflects updated ratings
      const publicRes = await request(app).get(`/api/v1/users/public/${farmer.customId}`);
      expect(publicRes.status).toBe(200);
      expect(publicRes.body.data.user.averageRating).toBe(4);
      expect(publicRes.body.data.user.ratingCount).toBe(3);
    });

    it("should fetch paginated reviews for a user by customId", async () => {
      await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder1._id,
          rating: 5,
          comment: "Superb product!",
        });

      const res = await request(app).get(`/api/v1/reviews/user/${farmer.customId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.reviews).toHaveLength(1);
      expect(res.body.data.reviews[0]).toEqual({
        id: expect.any(String),
        reviewerName: "Kebede Buyer",
        rating: 5,
        comment: "Superb product!",
        createdAt: expect.any(String),
      });

      // Confirm no extra reviewer details are leaked
      expect(res.body.data.reviews[0].reviewerPhone).toBeUndefined();
    });

    it("should indicate hasReviewed flag on order details endpoint", async () => {
      // Before review
      const beforeRes = await request(app)
        .get(`/api/v1/orders/${deliveredOrder1._id}`)
        .set("Authorization", `Bearer ${buyer.token}`);
      expect(beforeRes.status).toBe(200);
      expect(beforeRes.body.data.order.hasReviewed).toBe(false);

      // Submit review
      await request(app)
        .post("/api/v1/reviews")
        .set("Authorization", `Bearer ${buyer.token}`)
        .send({
          orderId: deliveredOrder1._id,
          rating: 5,
          comment: "Nice",
        });

      // After review
      const afterRes = await request(app)
        .get(`/api/v1/orders/${deliveredOrder1._id}`)
        .set("Authorization", `Bearer ${buyer.token}`);
      expect(afterRes.status).toBe(200);
      expect(afterRes.body.data.order.hasReviewed).toBe(true);
    });
  });
});
