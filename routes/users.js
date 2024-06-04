const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../schema/users");

const mongoURLString = process.env.DATABASE_URL;
mongoose.connect(mongoURLString);

const User = mongoose.model("User", userSchema);

router.post("/addUser", async (req, res) => {
  try {
    const { name, mobileNo, email, employeeType, employeeId, joiningDate } =
      req.body;
    const user = new User({
      name,
      mobileNo,
      email,
      employeeId,
      employeeType,
      joiningDate,
    });

    const savedUser = await user.save();
    console.log("User saved successfully");
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Failed to save user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Failed to get users:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

router.put("/editUser/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { name, mobileNo, employeeId, status, joiningDate } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        mobileNo,
        employeeId,
        status,
        joiningDate,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User updated successfully");
    res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/deleteUser/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User deleted successfully");
    res.json(deletedUser);
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
