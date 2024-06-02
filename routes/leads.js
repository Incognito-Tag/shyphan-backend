const express = require("express");
const multer = require("multer");
const { readXlsxFile } = require("read-excel-file");
const mongoose = require("mongoose");
const leadSchema = require("../schema/leads");
const userSchema = require("../schema/users");
const csv = require("csv-parser");
const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const upload = multer();

const mongoURLString = process.env.DATABASE_URL;
mongoose.connect(mongoURLString);

router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const Lead = mongoose.model("Lead", leadSchema);

  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  if (fileExtension === "csv") {
    const results = [];
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    stream
      .pipe(csv())
      .on("data", (data) => {
        results.push({
          _id: uuidv4(),
          name: data["Name"],
          mobileNo: data["Mobile No"],
          email: data["Email"],
          propertyType: data["Property Type"],
          leadSource: data["Lead Source"],
        });
      })
      .on("end", () => {
        Lead.insertMany(results)
          .then(() => {
            console.log("Leads saved successfully");
          })
          .catch((error) => {
            console.error("Failed to save leads:", error);
          });

        return res.json(results);
      });
  } else if (fileExtension === "xlsx") {
    readXlsxFile(file.buffer).then((rows) => {
      const results = rows.map((row) => ({
        _id: uuidv4(),
        name: row["Name"],
        mobileNo: row["Mobile No"],
        email: row["Email"],
        propertyType: row["Property Type"],
        leadSource: row["Lead Source"],
      }));

      const Lead = mongoose.model("Lead", leadSchema);
      Lead.insertMany(results)
        .then(() => {
          console.log("Leads saved successfully");
        })
        .catch((error) => {
          console.error("Failed to save leads:", error);
        });

      return res.json(results);
    });
  } else {
    return res.status(400).json({
      error: "Invalid file format. Only CSV and Excel files are supported.",
    });
  }
});

router.get("/getLeads", (req, res) => {
  const Lead = mongoose.model("Lead", leadSchema);

  Lead.find()
    .then((leads) => {
      res.json(leads);
    })
    .catch((error) => {
      console.error("Failed to get leads:", error);
      res.status(500).json({ error: "Failed to get leads" });
    });
});

router.post("/saveLead", (req, res) => {
  const { employeeCode, name, leads } = req.body;

  const User = mongoose.model("User", userSchema);

  User.findOne({ employeeCode })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.leads.push(...leads);

      user
        .save()
        .then(() => {
          res.json({ message: "Leads saved to the user successfully" });
        })
        .catch((error) => {
          console.error("Failed to save leads to the user:", error);
          res.status(500).json({ error: "Failed to save leads to the user" });
        });
    })
    .catch((error) => {
      console.error("Failed to find the user:", error);
      res.status(500).json({ error: "Failed to find the user" });
    });
});

module.exports = router;
