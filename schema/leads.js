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

  assignedTo: {
    type: String,
  },
  assignedAt: {
    type: Date,
  },

  propertyType: {
    type: String,
  },
  leadSource: {
    type: String,
  },

  location: {
    type: String,
  },
  followup: {
    type: String,
  },
  project: {
    type: String,
  },
  followupType: {
    type: String,
  },

  timeline: [
    {
      action: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = leadSchema;
