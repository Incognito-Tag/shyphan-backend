const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const router = express.Router();
const mongoose = require("mongoose");
const { Readable } = require("stream");

const upload = multer();

router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const leadSchema = new mongoose.Schema({
    name: String,
    mobileNo: String,
    email: String,
    propertyType: String,
    leadSource: String,
  });

  const mongoURLString = process.env.DATABASE_URL;
  mongoose.connect(mongoURLString);

  // Create a model based on the schema
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
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const results = data.map((row) => ({
      name: row["Name"],
      mobileNo: row["Mobile No"],
      email: row["Email"],
      propertyType: row["Property Type"],
      leadSource: row["Lead Source"],
    }));

    Lead.insertMany(finalRes)
      .then(() => {
        console.log("Leads saved successfully");
      })
      .catch((error) => {
        console.error("Failed to save leads:", error);
      });

    return res.json(results);
  } else {
    return res.status(400).json({
      error: "Invalid file format. Only CSV and Excel files are supported.",
    });
  }
});

module.exports = router;
