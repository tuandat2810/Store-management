const mongoose = require("mongoose");
const generate = require("../helpers/generateRandom");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    OTP: String,
    expireAt: { type: Date, expires: 300000 },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
