const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    mobileNo: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      validate(value) {
        if (!/^\d{10}$/.test(value)) {
          throw new Error("Mobile number must be exactly 10 digits");
        }
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      // unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Your Email is Not valid");
        }
      },
    },
    eventName: {
      type: String,
      required: true,
    },
    specialref: {
      type: String,
      default: "",
    },
    referalCodeUserEnter: {
      type: String,
      default: "",
    },

    referalcodeUserGenerated: {
      type: String,
    },
    eligibleForRefund: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
