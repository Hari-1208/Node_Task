const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: true,
      unique: false,
    },
    productCode: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    quantityAvailable: {
      type: Number,
      trim: true,
      required: true,
    },
    mrp: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);
