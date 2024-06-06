const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = require("../schema/users");

const router = express.Router();

const mongoURLString = process.env.DATABASE_URL;
const secretKey = process.env.SECRET_KEY;
mongoose.connect(mongoURLString);

const User = mongoose.model("User", userSchema);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.json({ token });
  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
