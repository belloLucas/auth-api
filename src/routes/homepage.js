const express = require("express");
const router = express.Router();

//Public route
router.get("/", (req, res) => {
  res.status(200).json({ msg: "API running" });
});

module.exports = router;
