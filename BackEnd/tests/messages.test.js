import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/modules/user/user.model.js";
import Message from "../src/modules/chat/message.model.js";

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
  await Message.deleteMany({});
});

describe("Messages API", () => {
  let user1Token;
  let user1Id;
  let user2Token;
  let user2Id;

  beforeEach(async () => {
    // Setup User 1
    const u1Res = await request(app).post("/api/v1/auth/register").send({
      name: "User One", phone: "0911000001", pin: "1234", role: "farmer", location: { region: "Oromia", zone: "A", kebele: "1" }
    });
    user1Id = u1Res.body.data.user.id;
    const login1 = await request(app).post("/api/v1/auth/login").send({ phone: "0911000001", pin: "1234" });
    user1Token = login1.body.data.token;

    // Setup User 2
    const u2Res = await request(app).post("/api/v1/auth/register").send({
      name: "User Two", phone: "0911000002", pin: "1234", role: "buyer", location: { region: "Amhara", zone: "B", kebele: "2" }
    });
    user2Id = u2Res.body.data.user.id;
    const login2 = await request(app).post("/api/v1/auth/login").send({ phone: "0911000002", pin: "1234" });
    user2Token = login2.body.data.token;
  });

  it("should send a message, encoding Amharic and Afan Oromo text correctly", async () => {
    const text = "ሰላም፣ ምርቱ አለ? / Akkam, oomishni jiraa?"; // Mixed Amharic / Afan Oromo
    const res = await request(app)
      .post("/api/v1/messages")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ receiverId: user2Id, text });
    
    expect(res.status).toBe(201);
    expect(res.body.data.message.text).toBe("ሰላም፣ ምርቱ አለ? / Akkam, oomishni jiraa?");
    expect(res.body.data.message.senderId).toBe(user1Id);
    expect(res.body.data.message.receiverId).toBe(user2Id);
  });

  it("should retrieve a conversation thread and mark messages as read", async () => {
    // User 1 sends message to User 2
    await request(app)
      .post("/api/v1/messages")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ receiverId: user2Id, text: "Hello" });

    // User 2 reads thread
    const res = await request(app)
      .get(`/api/v1/messages/${user1Id}`)
      .set("Authorization", `Bearer ${user2Token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.messages.length).toBe(1);
    expect(res.body.data.messages[0].text).toBe("Hello");
    expect(res.body.data.messages[0].read).toBe(true); // Auto-marked as read
  });
});
