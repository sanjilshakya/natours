const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  role: {
    type: String,
    enum: {
      values: ["admin", "user", "guide", "lead-guide"],
      message: "role should be either: admin, user, guide or lead-guide",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is a required field"],
    minlength: [8, "Password should be atleast 8 characters"],
    select: false,
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function(next){
  this.find({active: {$ne: false}})
  next()
})

// Instance Method
userSchema.methods.correctPassword = async function (
  reqBodyPassword,
  userPassowrd
) {
  // this returns true or false
  return await bcrypt.compare(reqBodyPassword, userPassowrd);
};

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //pw was changed then returns true or else false
    return jwtTimestamp < changedTimestamp;
  }
  //pw not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 30 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
