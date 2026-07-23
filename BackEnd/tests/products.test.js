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

describe("Product API", () => {
  let farmerToken;
  let buyerToken;
  let farmerId;

  beforeEach(async () => {
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

    // Auto-verify farmer so they can create products for the tests
    await User.findByIdAndUpdate(farmerId, { isVerified: true });

    // Setup buyer
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Buyer",
        phone: "0911000002",
        pin: "1234",
        role: "buyer",
        location: { region: "Amhara", zone: "B", wereda: "2" },
      });
    const loginBuyer = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: "0911000002", pin: "1234" });
    buyerToken = loginBuyer.body.data.token;
  });

  it("should block buyers from creating products", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ cropType: "Wheat", quantity: 10, price: 50 });

    expect(res.status).toBe(403);
  });

  it("should block an unverified farmer from creating a product", async () => {
    await User.findByIdAndUpdate(farmerId, { isVerified: false });

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ cropType: "Wheat", quantity: 10, price: 50 });

    expect(res.status).toBe(403);
  });

  it("should allow a verified farmer to create a product, encoding Amharic and Afan Oromo text correctly", async () => {
    const productData = {
      cropType: "ጤፍ / Xaafii", // Amharic and Afan Oromo mixed
      description: "በጣም ጥሩ ጥራት ያለው ጤፍ / Xaafii baay'ee gaarii dha",
      quantity: 20,
      price: 60,
      unit: "kg",
      location: { region: "Oromia", zone: "East Shewa", wereda: "Meki" },
    };

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send(productData);

    expect(res.status).toBe(201);
    expect(res.body.data.product.cropType).toBe("ጤፍ / Xaafii");
    expect(res.body.data.product.description).toBe(
      "በጣም ጥሩ ጥራት ያለው ጤፍ / Xaafii baay'ee gaarii dha",
    );
    // New listings default to "active" — there is no approval workflow
    // for products in the MVP (only user accounts go through Admin
    // approval). See BackEnd/docs/POST_MVP_BACKLOG.md for the broken,
    // unused admin product-approval endpoints that once assumed
    // otherwise.
    expect(res.body.data.product.status).toBe("active");
  });

  it("should reject creating a product without required fields", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ description: "Missing cropType, quantity, price" });

    expect(res.status).toBe(400);
  });

  it("buyers (and the public) can browse active listings without auth", async () => {
    await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ cropType: "Tomato", quantity: 15, price: 40 });

    const getRes = await request(app).get("/api/v1/products");

    expect(getRes.status).toBe(200);
    expect(getRes.body.data.products.length).toBe(1);
    expect(getRes.body.data.products[0].cropType).toBe("Tomato");
  });

  it("supports filtering by cropType and region", async () => {
    await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({
        cropType: "Onion",
        quantity: 5,
        price: 30,
        location: { region: "Oromia" },
      });
    await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({
        cropType: "Tomato",
        quantity: 5,
        price: 25,
        location: { region: "Amhara" },
      });

    const res = await request(app)
      .get("/api/v1/products")
      .query({ cropType: "onion" }) // case-insensitive partial match
      .set("Authorization", `Bearer ${buyerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBe(1);
    expect(res.body.data.products[0].cropType).toBe("Onion");
  });

  it("only the owning farmer can update or delete their own listing", async () => {
    const createRes = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ cropType: "Maize", quantity: 8, price: 22 });
    const productId = createRes.body.data.product._id;

    // A second farmer shouldn't be able to touch it
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Other Farmer",
        phone: "0911000003",
        pin: "1234",
        role: "farmer",
        location: { region: "Oromia", zone: "A", wereda: "1" },
      });
    const otherLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ phone: "0911000003", pin: "1234" });
    await User.findByIdAndUpdate(otherLogin.body.data.user.id, {
      isVerified: true,
    });

    const forbiddenUpdate = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${otherLogin.body.data.token}`)
      .send({ price: 999 });
    expect(forbiddenUpdate.status).toBe(403);

    const okUpdate = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ price: 30 });
    expect(okUpdate.status).toBe(200);
    expect(okUpdate.body.data.product.price).toBe(30);
  });
});
