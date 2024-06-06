const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  password: {
    type: String,
    required: true,
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

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = userSchema;
