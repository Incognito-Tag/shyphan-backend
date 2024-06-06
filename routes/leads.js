const express = require("express");
const multer = require("multer");
const { readXlsxFile } = require("read-excel-file");
const mongoose = require("mongoose");
const leadSchema = require("../schema/leads");
const userSchema = require("../schema/users");
const csv = require("csv-parser");
const { Readable } = require("stream");

const router = express.Router();
const upload = multer();

const mongoURLString = process.env.DATABASE_URL;
mongoose.connect(mongoURLString);

const Lead = mongoose.model("Lead", leadSchema);
const User = mongoose.model("User", userSchema);

router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  try {
    let results;

    if (fileExtension === "csv") {
      results = await parseCsvFile(file.buffer);
    } else if (fileExtension === "xlsx") {
      results = await parseXlsxFile(file.buffer);
    } else {
      return res.status(400).json({
        error: "Invalid file format. Only CSV and Excel files are supported.",
      });
    }

    await Lead.insertMany(results);
    console.log("Leads saved successfully");
    return res.json(results);
  } catch (error) {
    console.error("Failed to save leads:", error);
    return res.status(500).json({ error: "Failed to save leads" });
  }
});

router.get("/getAllLeads", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    console.error("Failed to get leads:", error);
    res.status(500).json({ error: "Failed to get leads" });
  }
});

router.get("/getUnassignedLeads", async (req, res) => {
  try {
    const leads = await Lead.find({ assignedTo: { $exists: false } });
    res.json(leads);
  } catch (error) {
    console.error("Failed to get unassigned leads:", error);
    res.status(500).json({ error: "Failed to get unassigned leads" });
  }
});

router.post("/getAvailableLeadsForDates", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const endDatePlusOneDay = new Date(
      new Date(endDate).getTime() + 2 * 24 * 60 * 60 * 1000 - 1
    );
    const leadsCount = await Lead.countDocuments({
      assignedTo: { $exists: false },
      createdAt: { $gte: new Date(startDate), $lte: endDatePlusOneDay },
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
      unassignedLead: leadsCount,
      brokerCount: brokerCount,
      telecallerCount: telecallerCount,
      employeeCount: employeeCount,
    });
  } catch (error) {
    console.error("Failed to get unassigned leads:", error);
    res.status(500).json({ error: "Failed to get unassigned leads" });
  }
});

router.post("/assignLeadsByUserType", async (req, res) => {
  const { userType, startDate, endDate, userCount } = req.body;

  try {
    const users = await User.find({ employeeType: userType }).limit(userCount);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found for the specified user type" });
    }

    const endDatePlusOneDay = new Date(
      new Date(endDate).getTime() + 2 * 24 * 60 * 60 * 1000 - 1
    );
    const leads = await Lead.find({
      assignedTo: { $exists: false },
      createdAt: { $gte: new Date(startDate), $lte: endDatePlusOneDay },
    });

    if (leads.length === 0) {
      return res
        .status(404)
        .json({ error: "No leads available for the specified date range" });
    }

    const leadsPerUser = Math.floor(leads.length / users.length);
    const remainingLeads = leads.length % users.length;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const startIndex = i * leadsPerUser;
      const endIndex = (i + 1) * leadsPerUser;
      const userLeads = leads.slice(startIndex, endIndex);

      if (i === users.length - 1) {
        userLeads.push(...leads.slice(endIndex, endIndex + remainingLeads));
      }

      user.leads.push(...userLeads);
      await user.save();

      await Lead.updateMany(
        { _id: { $in: userLeads.map((lead) => lead._id) } },
        { assignedTo: user.employeeId, assignedAt: new Date() }
      );
    }

    res.json({ message: "Leads assigned to users successfully" });
  } catch (error) {
    console.error("Failed to assign leads to users:", error);
    res.status(500).json({ error: "Failed to assign leads to users" });
  }
});

router.post("/assignLeadsToUser", async (req, res) => {
  const { employeeId, leads } = req.body;

  try {
    const user = await User.findOne({ employeeId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.leads.push(...leads);
    await user.save();

    Lead.updateMany(
      { _id: { $in: leads } },
      { assignedTo: employeeId, assignedAt: new Date() }
    );

    res.json({ message: "Leads saved to the user successfully" });
  } catch (error) {
    console.error("Failed to save leads to the user:", error);
    res.status(500).json({ error: "Failed to save leads to the user" });
  }
});

async function parseCsvFile(buffer) {
  const results = [];
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (data) => {
        results.push({
          name: data["Name"],
          mobileNo: data["Mobile No"],
          email: data["Email"],
          propertyType: data["Property Type"],
          leadSource: data["Lead Source"],
        });
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function parseXlsxFile(buffer) {
  const rows = await readXlsxFile(buffer);
  return rows.map((row) => ({
    name: row[0],
    mobileNo: row[1],
    email: row[2],
    propertyType: row[3],
    leadSource: row[4],
  }));
}

module.exports = router;
