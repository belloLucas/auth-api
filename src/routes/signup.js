const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User.js");

//Register
router.post("/auth/register", async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "O nome é obrigatório" });
  }
  if (!email) {
    return res.status(400).json({ msg: "O email é obrigatório" });
  }
  if (!phone) {
    return res.status(400).json({ msg: "O telefone é obrigatório" });
  }
  if (!password) {
    return res.status(400).json({ msg: "A senha é obrigatória" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "As senhas devem ser as mesmas" });
  }

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(422).json({
      msg: "E-mail já cadastrado. Tente realizar login ou utilizar outro e-mail",
    });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    phone,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
