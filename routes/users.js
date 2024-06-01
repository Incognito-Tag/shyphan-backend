const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../schema/users");

const mongoURLString = process.env.DATABASE_URL;
mongoose.connect(mongoURLString);

const User = mongoose.model("User", userSchema);

router.post("/addUser", (req, res) => {
  const { name, mobileNo, email, employeeCode, status, joiningDate } = req.body;

  const user = new User({
    name,
    mobileNo,
    email,
    employeeCode,
    status,
    joiningDate,
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

router.get("/getUsers", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error("Failed to get users:", error);
      res.status(500).json({ error: "Failed to get users" });
    });
});

router.put("/editUser", (req, res) => {
  const { email, name, mobileNo, employeeCode, status, joiningDate } = req.body;

  User.findOneAndUpdate(
    { email },
    {
      name,
      mobileNo,
      employeeCode,
      status,
      joiningDate,
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("User updated successfully");
      res.json(updatedUser);
    })
    .catch((error) => {
      console.error("Failed to update user:", error);
      res.status(500).json({ error: "Failed to update user" });
    });
});

module.exports = router;
