const request = require("supertest");
const express = require("express");
const router = require("../routes/homepage"); // Substitua pelo caminho real do seu arquivo de rota

const app = express();
app.use("/", router);

describe("Rota principal", () => {
  test("Deve retornar status 200 e a mensagem 'API running'", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: "API running" });
  });
});
