const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

const expiresIn = 1800;

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Campo e-mail deve ser preenchido" });
  }
  if (!password) {
    return res.status(400).json({ msg: "Campo senha deve ser preenchido" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ msg: "Usuário com o e-mail fornecido não foi encontrado" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(401).json({ msg: "Senha incorreta" });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      { expiresIn }
    );
    res.status(200).json({ msg: "Usuário conectado com sucesso!", token });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Ocorreu um erro, tente novamente mais tarde." });
  }
});

module.exports = router;
