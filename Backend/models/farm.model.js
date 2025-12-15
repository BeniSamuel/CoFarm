const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    cropAmount: {
      type: Number,
      default: 0,
    },
    cropCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String, // URLs to images
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
