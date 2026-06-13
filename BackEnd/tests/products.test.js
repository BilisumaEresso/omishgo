import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/modules/user/user.model.js";
import Product from "../src/modules/product/product.model.js";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omishgo_test");
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

  beforeEach(async () => {
    // Setup farmer
    const farmerRes = await request(app).post("/api/v1/auth/register").send({
      name: "Farmer", phone: "0911000001", pin: "1234", role: "farmer", location: { region: "Oromia", zone: "A", kebele: "1" }
    });
    const loginFarmer = await request(app).post("/api/v1/auth/login").send({ phone: "0911000001", pin: "1234" });
    farmerToken = loginFarmer.body.data.token;

    // Setup buyer
    await request(app).post("/api/v1/auth/register").send({
      name: "Buyer", phone: "0911000002", pin: "1234", role: "buyer", location: { region: "Amhara", zone: "B", kebele: "2" }
    });
    const loginBuyer = await request(app).post("/api/v1/auth/login").send({ phone: "0911000002", pin: "1234" });
    buyerToken = loginBuyer.body.data.token;
  });

  it("should block buyers from creating products", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({ title: "Wheat", price: 50 });
    
    expect(res.status).toBe(403);
  });

  it("should allow farmers to create products, encoding Amharic and Afan Oromo text correctly", async () => {
    const productData = {
      title: "ጤፍ / Xaafii", // Amharic and Afan Oromo mixed
      description: "በጣም ጥሩ ጥራት ያለው ጤፍ / Xaafii baay'ee gaarii dha",
      price: 60,
      unit: "kg",
      region: "Oromia"
    };

    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send(productData);
    
    expect(res.status).toBe(201);
    expect(res.body.data.product.title).toBe("ጤፍ / Xaafii");
    expect(res.body.data.product.description).toBe("በጣም ጥሩ ጥራት ያለው ጤፍ / Xaafii baay'ee gaarii dha");
    expect(res.body.data.product.status).toBe("pending");
  });

  it("should only allow buyers to view approved products", async () => {
    // Create pending product
    await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${farmerToken}`)
      .send({ title: "Pending Wheat", price: 40 });

    const getRes = await request(app)
      .get("/api/v1/products")
      .set("Authorization", `Bearer ${buyerToken}`);
    
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.products.length).toBe(0); // Because it's pending
  });
});
