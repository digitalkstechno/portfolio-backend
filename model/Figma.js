const mongoose = require("mongoose");

const figmaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: null,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["application", "web", "saas-dashboard"],
      default: "application",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Figma", figmaSchema);
