import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import Product from "../src/modules/product/product.model.js";
import User from "../src/modules/user/user.model.js";

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

describe("Admin API", () => {
  let adminToken;
  let farmerToken;
  let farmerId;

  beforeEach(async () => {
    // Setup admin
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Admin",
        phone: "0911000000",
        pin: "1234",
        role: "admin",
        location: { region: "A", zone: "B", wereda: "C" },
      });
    const loginAdmin = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: "0911000000", pin: "1234" });
    adminToken = loginAdmin.body.data.token;

    // Setup farmer
    const farmerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Farmer",
        phone: "0911000001",
        pin: "1234",
        role: "farmer",
        location: { region: "Oromia", zone: "A", wereda: "1" },
      });
    farmerId = farmerRes.body.data.user.id;
    const loginFarmer = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: "0911000001", pin: "1234" });
    farmerToken = loginFarmer.body.data.token;
  });

  it("should block non-admins from accessing admin routes", async () => {
    const res = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${farmerToken}`);

    expect(res.status).toBe(403);
  });

  it("should allow admin to approve a user", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/users/${farmerId}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.isVerified).toBe(true);
  });

  it("should allow admin to approve a product", async () => {
    const prodRes = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ title: "Wheat", price: 40 });

    const productId = prodRes.body.data.product._id;

    const approveRes = await request(app)
      .put(`/api/v1/admin/products/${productId}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.product.status).toBe("approved");
  });
});
