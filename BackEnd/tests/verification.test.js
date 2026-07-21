import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/modules/user/user.model.js";
import Product from "../src/modules/product/product.model.js";

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
});

describe("Verification Gate", () => {
  const farmer = {
    name: "Test Farmer",
    phone: "0911000001",
    pin: "1234",
    role: "farmer",
    location: { region: "Oromia", zone: "Jimma", wereda: "Seka" },
    preferredLang: "om",
  };

  const validProduct = {
    cropType: "Teff",
    quantity: 100,
    unit: "kg",
    price: 50,
    description: "Fresh teff",
  };

  async function registerAndLogin(userData) {
    await request(app).post("/api/v1/auth/register").send(userData);
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: userData.phone, pin: userData.pin });
    return loginRes.body.data;
  }

  it("should register a new user with isVerified = false", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(farmer);

    expect(res.status).toBe(201);
    // Check the DB directly to confirm isVerified is false
    const user = await User.findOne({ phone: farmer.phone });
    expect(user.isVerified).toBe(false);
  });

  it("should return 403 when unverified farmer tries to create a product", async () => {
    const { token } = await registerAndLogin(farmer);

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .send(validProduct);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/pending Admin approval/i);
  });

  it("should allow product creation after Admin approval", async () => {
    const { token, user } = await registerAndLogin(farmer);

    // Simulate Admin approval: directly update isVerified in DB
    await User.findOneAndUpdate({ phone: farmer.phone }, { isVerified: true });

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .send(validProduct);

    expect(res.status).toBe(201);
    expect(res.body.data.product).toHaveProperty("cropType", "Teff");
  });

  it("should return 403 when unverified user tries to send a message", async () => {
    const { token } = await registerAndLogin(farmer);

    const res = await request(app)
      .post("/api/v1/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ receiverId: new mongoose.Types.ObjectId(), content: "Hello" });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/pending Admin approval/i);
  });

  it("should return 403 when unverified buyer tries to create an order", async () => {
    const buyer = { ...farmer, phone: "0911000002", role: "buyer" };
    const { token } = await registerAndLogin(buyer);

    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: new mongoose.Types.ObjectId(), quantity: 10 });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/pending Admin approval/i);
  });

  it("should allow GET /products for unverified users (browsing is open)", async () => {
    const res = await request(app).get("/api/v1/products");
    expect(res.status).toBe(200);
  });
});
