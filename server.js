require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiLeads = require("./routes/leads");
const apiUsers = require("./routes/users");
const apiFollowup = require("./routes/followup");

const PORT = process.env.PORT;
const mongoURLString = process.env.DATABASE_URL;

mongoose.connect(mongoURLString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
app.use(express.json());
app.use(cors());

const router = express.Router();
router.get("/", function (req, res, next) {
  res.send("Server is up and running fine :)");
});
app.use(router);

app.use("/api/leads", apiLeads);
app.use("/api/users", apiUsers);
app.use("/api/followup", apiFollowup);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
