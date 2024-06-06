const express = require("express");
const mongoose = require("mongoose");
const leadSchema = require("../schema/leads");
const userSchema = require("../schema/users");

const router = express.Router();

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

router.post("/editAssignedLead", async (req, res) => {
  const { leadId, location, followup, project, followupType } = req.body;

  try {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    lead.location = location || lead.location;
    lead.followup = followup || lead.followup;
    lead.project = project || lead.project;
    lead.followupType = followupType || lead.followupType;

    await lead.save();

    res.json({ message: "Lead information updated successfully" });
  } catch (error) {
    console.error("Failed to update lead information:", error);
    res.status(500).json({ error: "Failed to update lead information" });
  }
});

router.post("/storeUserAction", async (req, res) => {
  const { leadId, action, description } = req.body;

  try {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    lead.timeline.push({
      action,
      description,
      timestamp: new Date(),
    });

    await lead.save();

    res.json({ message: "User action stored successfully" });
  } catch (error) {
    console.error("Failed to store user action:", error);
    res.status(500).json({ error: "Failed to store user action" });
  }
});

module.exports = router;
