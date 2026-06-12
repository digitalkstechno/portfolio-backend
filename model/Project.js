const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ["ecommerce", "informative", "innovation"],
    default: "ecommerce",
    index: true
  },
  description: {
    type: String,
    required: false,
    default: ""
  },
  language: {
    type: String,
    required: false,
    trim: true,
    default: ""
  },
  credentials: [{
    role: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);
