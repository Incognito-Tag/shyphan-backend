const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  employeeId: {
    type: String,
    unique: true,
  },
  employeeType: {
    type: String,
    enum: ["admin", "telecaller", "employee", "broker"],
    required: true,
    default: "active",
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  leads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  ],
});

module.exports = userSchema;
