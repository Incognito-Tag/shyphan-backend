const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const mongoURLString = process.env.DATABASE_URL;
mongoose.connect(mongoURLString);

const userSchema = new mongoose.Schema({
  name: String,
  mobileNo: String,
  email: String,
  employeeCode: String,
  isActive: Boolean,
  joiningDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

router.post("/addUser", (req, res) => {
  const { name, mobileNo, email, employeeCode, isActive } = req.body;

  const user = new User({
    name,
    mobileNo,
    email,
    employeeCode,
    isActive,
  });

  user
    .save()
    .then((savedUser) => {
      console.log("User saved successfully");
      res.status(201).json(savedUser);
    })
    .catch((error) => {
      console.error("Failed to save user:", error);
      res.status(500).json({ error: "Failed to add user" });
    });
});

module.exports = router;
