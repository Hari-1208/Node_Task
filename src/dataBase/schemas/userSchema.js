const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minlength: 10,
      unique: false,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      unique: false,
    },
    emailId: {
      type: String,
      required: true,
      unique: false,
    },
    dob: {
      type: String,
      required: true,
      unique: false,
    },
    userType: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);
