const express = require("express");
const leadsRouter = require("./api/leads");
const mongoose = require("mongoose");
const PORT = "8000";

const app = express();

app.use(express.json());

app.use("/api/leads", leadsRouter);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
