const express = require("express");
const multer = require("multer");
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require("xlsx");

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

// Endpoint to handle file upload and return JSON
router.post("/uploadCSVorExcel", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  if (fileExtension === "csv") {
    // Process CSV file
    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push({
          name: data.name,
          mobileNo: data.mobileNo,
          email: data.email,
          propertyType: data.propertyType,
          leadSource: data.leadSource,
        });
      })
      .on("end", () => {
        res.json(results);
      });
  } else if (fileExtension === "xlsx") {
    // Process Excel file
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const results = data.map((row) => ({
      name: row.name,
      mobileNo: row.mobileNo,
      email: row.email,
      propertyType: row.propertyType,
      leadSource: row.leadSource,
    }));

    res.json(results);
  } else {
    return res.status(400).json({
      error: "Invalid file format. Only CSV and Excel files are supported.",
    });
  }
});

module.exports = router;
