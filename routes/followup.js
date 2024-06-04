const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const leadSchema = require("../schema/leads");
const userSchema = require("../schema/users");

const mongoURLString = process.env.DATABASE_URL;
mongoose.connect(mongoURLString);

const Lead = mongoose.model("Lead", leadSchema);
const User = mongoose.model("User", userSchema);

router.get("/countLeadsFollowup", async (req, res) => {
  try {
    const leadsCount = await Lead.countDocuments({
      assignedTo: { $exists: false },
    });
    const brokerCount = await User.countDocuments({
      employeeType: { $in: ["broker"] },
    });
    const telecallerCount = await User.countDocuments({
      employeeType: { $in: ["telecaller"] },
    });
    const employeeCount = await User.countDocuments({
      employeeType: { $in: ["employee"] },
    });
    res.json({
      unassginedLead: leadsCount,
      brokerCount: brokerCount,
      telecallerCount: telecallerCount,
      employeeCount: employeeCount,
    });
  } catch (error) {
    console.error("Failed to get counts:", error);
    res.status(500).json({ error: "Failed to get counts" });
  }
});

module.exports = router;
