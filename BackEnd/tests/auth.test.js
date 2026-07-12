import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/modules/user/user.model.js";

// Mock DB connection - normally you'd connect to a real test DB
beforeAll(async () => {
  // If not already connected
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
});

describe("Auth API", () => {
  const validFarmer = {
    name: "Bilisuma Eresso",
    phone: "0911223344",
    pin: "1234",
    role: "farmer",
    location: { region: "Oromia", zone: "Jimma", wereda: "01" },
    preferredLang: "om",
  };

  it("should register a farmer without an email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validFarmer);

    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty("phone", "0911223344");
    expect(res.body.data.user).not.toHaveProperty("pinHash");
  });

  it("should register a buyer with an optional email", async () => {
    const validBuyer = {
      ...validFarmer,
      phone: "0999887766",
      role: "buyer",
      email: "buyer@test.com",
    };
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(validBuyer);

    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty("email", "buyer@test.com");
  });

  it("should fail validation on invalid PIN length", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...validFarmer, pin: "12" }); // Too short
    expect(res.status).toBe(400); // Bad request from zod validation
  });

  it("should fail validation on invalid phone length", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...validFarmer, phone: "123" }); // Too short
    expect(res.status).toBe(400);
  });

  it("should login successfully with valid phone and PIN", async () => {
    await request(app).post("/api/v1/auth/register").send(validFarmer);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: "0911223344", pin: "1234" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toHaveProperty("role", "farmer");
  });

  it("should retrieve profile via GET /me using token", async () => {
    await request(app).post("/api/v1/auth/register").send(validFarmer);
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: "0911223344", pin: "1234" });
    const token = loginRes.body.data.token;

    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.name).toBe("Bilisuma Eresso");
  });
});
