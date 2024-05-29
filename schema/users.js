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
  employeeCode: {
    type: String,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = userSchema;
