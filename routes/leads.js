const express = require("express");
const multer = require("multer");
const { readXlsxFile } = require("read-excel-file");
const mongoose = require("mongoose");
const leadSchema = require("../schema/leads");

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const mongoURLString = process.env.DATABASE_URL;
  mongoose.connect(mongoURLString);

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
    readXlsxFile(file.buffer).then((rows) => {
      const results = rows.map((row) => ({
        name: row["Name"],
        mobileNo: row["Mobile No"],
        email: row["Email"],
        propertyType: row["Property Type"],
        leadSource: row["Lead Source"],
      }));

      // Save to MongoDB
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

module.exports = router;
