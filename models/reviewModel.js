const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review is a required field."],
    },
    rating: {
      type: Number,
      required: [true, "rating is a required field."],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.find().populate('tour user')
  this.find()
    .populate({
      path: "tour",
      select: "name",
    })
    .populate({
      path: "user",
      select: "name",
    });
  next();
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
