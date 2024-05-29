const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const { Readable } = require("stream");

const router = express.Router();

const upload = multer();

router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

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
        res.json(results);
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

    res.json(results);
  } else {
    return res.status(400).json({
      error: "Invalid file format. Only CSV and Excel files are supported.",
    });
  }
});

module.exports = router;