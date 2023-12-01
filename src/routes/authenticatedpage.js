const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

const checkToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso não autorizado." });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      res
        .status(400)
        .json({ msg: "Token expirado: Realize o login novamente." });
    }
    res.status(400).json({ msg: "Token inválido: Acesso não autorizado." });
  }
};

//Private route
router.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ msg: "Formato do ID inválido." });
    }

    res.status(500).json({ msg: "Erro ao buscar pelo usuário." });
  }
});

module.exports = router;
