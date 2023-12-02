require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const homepage = require("./src/routes/homepage.js");
const signup = require("./src/routes/signup.js");
const signIn = require("./src/routes/signIn.js");
const auththenticatedPage = require("./src/routes/authenticatedpage.js");
const changePassword = require("./src/routes/changePassword.js");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

app.use("/", homepage);

app.use("/", signup);

app.use("/", signIn);

app.use("/", auththenticatedPage);

app.use("/", changePassword);

app.use((req, res) => {
  res.status(404).json({ msg: "Página não encontrada." });
});

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@auth.ayi1vyy.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`DB Connected`);
    });
  })
  .catch((err) => console.log(err));
