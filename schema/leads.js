const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
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

  propertyType: {
    type: String,
    enum: ["Apartment", "House", "Land", "Commercial"],
  },
  leadSource: {
    type: String,
    enum: ["Website", "Referral", "Advertisement", "Other"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = leadSchema;
