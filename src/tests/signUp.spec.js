const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = express();
const router = require("../routes/signup"); // Substitua pelo caminho real do seu arquivo de rota
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

describe("POST /auth/register", () => {
  it("should register a new user", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123456789",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json")
      .expect(201);

    expect(response.body.msg).toBe("Usuário criado com sucesso");
  });

  it("should return 400 if name is missing", async () => {
    const userData = {
      email: "john.doe@example.com",
      phone: "123456789",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body.msg).toContain("O nome é obrigatório");
  });

  it("should return 400 if email is missing", async () => {
    const userData = {
      name: "John Doe",
      phone: "123456789",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body.msg).toContain("O email é obrigatório");
  });

  it("should return 400 if phone is missing", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json")
      .expect(400);
    expect(response.body.msg).toContain("O telefone é obrigatório");
  });

  it("should return 400 if password is missing", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123456789",
      confirmPassword: "password123",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .set("Content-Type", "application/json")
      .expect(400);
    expect(response.body.msg).toContain("A senha é obrigatória");
  });

  it("should return 400 if passwords do not match", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123456789",
      password: "password123",
      confirmPassword: "password456",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .expect(400);

    expect(response.body.msg).toBe("As senhas devem ser as mesmas");
  });

  it("should return 422 if the email is already registered", async () => {
    const existingUser = new User({
      name: "Existing User",
      email: "existing.user@example.com",
      phone: "987654321",
      password: await bcrypt.hash("existingPassword", 12),
    });
    await existingUser.save();

    const userData = {
      name: "John Doe",
      email: "existing.user@example.com",
      phone: "123456789",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await supertest(app)
      .post("/auth/register")
      .send(userData)
      .expect(422);

    expect(response.body.msg).toContain("E-mail já cadastrado");
  });
});
