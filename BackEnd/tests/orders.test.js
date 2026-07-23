import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import Product from "../src/modules/product/product.model.js";
import User from "../src/modules/user/user.model.js";
import Order from "../src/modules/order/order.model.js";

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
});

async function registerAndLogin(phone, role) {
  const registerRes = await request(app).post("/api/v1/auth/register").send({
    name: role === "farmer" ? "Farmer" : "Buyer",
    phone,
    pin: "1234",
    role,
    location: { region: "Oromia", zone: "A", wereda: "1" },
  });
  await User.findByIdAndUpdate(registerRes.body.data.user.id, {
    isVerified: true,
  });
  const loginRes = await request(app)
    .post("/api/v1/auth/login")
    .send({ phone, pin: "1234" });
  return { token: loginRes.body.data.token, id: registerRes.body.data.user.id };
}

describe("Order stock handling", () => {
  let farmerToken;
  let buyerToken;
  let buyer2Token;
  let productId;

  beforeEach(async () => {
    const farmer = await registerAndLogin("0911100001", "farmer");
    farmerToken = farmer.token;

    const buyer = await registerAndLogin("0911100002", "buyer");
    buyerToken = buyer.token;

    const buyer2 = await registerAndLogin("0911100003", "buyer");
    buyer2Token = buyer2.token;

    const productRes = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ cropType: "Tomato", quantity: 10, price: 20, unit: "kg" });
    productId = productRes.body.data.product._id;
  });

  it("decrements product quantity when an order is placed", async () => {
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId, quantity: 4 })
      .expect(201);

    const product = await Product.findById(productId);
    expect(product.quantity).toBe(6);
    expect(product.status).toBe("active");
  });

  it("rejects an order that would exceed remaining stock", async () => {
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId, quantity: 7 })
      .expect(201);

    // Only 3 left — asking for 5 should fail, not oversell.
    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyer2Token}`)
      .send({ productId, quantity: 5 });

    expect(res.status).toBe(400);
    const product = await Product.findById(productId);
    expect(product.quantity).toBe(3);
  });

  it("marks the product sold once quantity reaches zero", async () => {
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId, quantity: 10 })
      .expect(201);

    const product = await Product.findById(productId);
    expect(product.quantity).toBe(0);
    expect(product.status).toBe("sold");

    // No stock left at all — further orders must be rejected.
    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyer2Token}`)
      .send({ productId, quantity: 1 });
    expect(res.status).toBe(400);
  });

  it("restores stock and reactivates the listing when an order is cancelled", async () => {
    const orderRes = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ productId, quantity: 10 })
      .expect(201);

    let product = await Product.findById(productId);
    expect(product.quantity).toBe(0);
    expect(product.status).toBe("sold");

    const orderId = orderRes.body.data.order._id;
    await request(app)
      .patch(`/api/v1/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ status: "cancelled" })
      .expect(200);

    product = await Product.findById(productId);
    expect(product.quantity).toBe(10);
    expect(product.status).toBe("active");
  });

  it("does not let two simultaneous orders oversell the last unit", async () => {
    await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ cropType: "Onion", quantity: 1, price: 15, unit: "kg" });

    const soloRes = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ cropType: "Potato", quantity: 1, price: 15, unit: "kg" });
    const soloId = soloRes.body.data.product._id;

    // Fire two concurrent order attempts for the same single-unit listing.
    const [res1, res2] = await Promise.all([
      request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({ productId: soloId, quantity: 1 }),
      request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${buyer2Token}`)
        .send({ productId: soloId, quantity: 1 }),
    ]);

    const statuses = [res1.status, res2.status].sort((a, b) => a - b);
    expect(statuses).toEqual([201, 409]);

    const product = await Product.findById(soloId);
    expect(product.quantity).toBe(0);
  });
});
