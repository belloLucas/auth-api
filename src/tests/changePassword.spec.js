const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = express();

const router = require("../routes/changePassword");
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

describe("PATCH /user/update/:id", () => {
  test("it should update the user password", async () => {
    const salt = await bcrypt.genSalt(12);
    const newPassword = "newPassword";

    const user = new User({
      email: "test@example.com",
      password: await bcrypt.hash("oldPassword", salt),
    });
    await user.save();

    const response = await supertest(app)
      .patch(`/user/update/${user._id}`)
      .send({
        email: "test@example.com",
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(response.status).toBe(200);

    const updatedUser = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(
      newPassword,
      updatedUser.password
    );
    expect(passwordMatch).toBe(true);
  });

  test("it should handle missing email", async () => {
    const response = await supertest(app).patch("/user/update/123").send({
      password: "newPassword",
      confirmPassword: "newPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("O e-mail deve ser preenchido");
  });
});
