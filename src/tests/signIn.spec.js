const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = require("../routes/signIn");
const User = require("../models/User");

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

const createTestUser = async () => {
  const password = await bcrypt.hash("senha123", 10);
  return await User.create({
    email: "test@example.com",
    password: password,
  });
};

describe("POST /auth/login", () => {
  it("should return 400 if email is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: "senha123" });
    expect(response.status).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com" });
    expect(response.status).toBe(400);
  });

  it("should return 404 if user with provided email is not found", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "nonexistent@example.com", password: "senha123" });
    expect(response.status).toBe(404);
  });

  it("should return 401 if password is incorrect", async () => {
    const user = await createTestUser();
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "incorrectPassword" });
    expect(response.status).toBe(401);
  });

  it("should return 200 with a valid token on successful login", async () => {
    const user = await createTestUser();
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "senha123" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(decodedToken.id).toBe(String(user._id));
  });

  it("should return 500 if an error occurs during token generation", async () => {
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error("Mocked error");
    });

    const user = await createTestUser();
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "senha123" });

    expect(response.status).toBe(500);

    // Restore the original implementation after the test
    jwt.sign.mockRestore();
  });
});
