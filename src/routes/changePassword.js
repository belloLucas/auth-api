const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User.js");

router.patch("/user/update/:id", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "O e-mail deve ser preenchido" });
  }

  if (!password) {
    return res.status(400).json({ msg: "A nova senha deve ser preenchida" });
  }

  if (!confirmPassword) {
    return res
      .status(400)
      .json({ msg: "A senha de confirmação deve ser preenchida" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "As senhas devem ser iguais" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    const userId = req.params.id;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: passwordHash } },
      {
        new: true,
      }
    );
    res.json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Algo deu errado. Tente novamente." });
  }
});

module.exports = router;
