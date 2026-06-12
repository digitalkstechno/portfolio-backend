const mongoose = require("mongoose");

const mobileAppSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  androidLink: {
    type: String,
    trim: true,
    default: null
  },
  iosLink: {
    type: String,
    trim: true,
    default: null
  },
  image: {
    type: String,
    default: null
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
  software: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("MobileApp", mobileAppSchema);
