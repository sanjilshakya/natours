const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    lowercase: true,
    validate: [
      validator.isEmail,
      "Please enter a valid email. Ex: abc@gmail.com",
    ],
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password is a required field"],
    minlength: [8, "Password should be atleast 8 characters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is a required field"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password and Confirm Password doesn't match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
