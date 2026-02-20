const mongoose = require("mongoose");

const softwareSchema = new mongoose.Schema({
  // key: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true
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

module.exports = mongoose.model("Software", softwareSchema);
