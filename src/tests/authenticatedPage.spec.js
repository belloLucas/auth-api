const express = require("express");
const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const router = require("../routes/authenticatedpage");
const User = require("../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");

app.use(express.json());

app.use("/", router);

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("GET /user/:id", () => {
  it("should return user information when a valid token is provided", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123456789",
      password: "password123",
      confirmPassword: "password123",
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const response = await supertest(app)
      .get(`/user/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.user).toBeDefined();
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(app).get("/user/123").expect(401);

    expect(response.body.msg).toBe("Acesso não autorizado.");
  });
});
