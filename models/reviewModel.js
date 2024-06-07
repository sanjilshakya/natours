const mongoose = require("mongoose");

const Tour = require("./tourModel");

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

// Create a index to restrict user to review multiple time in same tour.
reviewSchema.index({tour:1, user:1},{unique:true})

reviewSchema.statics.calcRatingsAverage = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0]?.nRating || 0,
    ratingsAverage: stats[0]?.avgRating || 4.5,
  });
};

reviewSchema.pre(/^find/, function (next) {
  // this.find().populate('tour user')
  this.find().populate({
    path: "user",
    select: "name",
  });
  next();
});

// To update the tour's ratingsAverage and ratingsQuantity once review is created.
reviewSchema.post("save", function () {
  // this point to current review
  // this.constructor points to the model i.e Review
  this.constructor.calcRatingsAverage(this.tour);
});

// findByIdAndUpdate and findByIdAndDelete
// reviewSchema.post(
//   ["findOneAndUpdate", "findOneAndDelete"],
//   function (doc, next) {
//     mongoose.model("Review").calcRatingsAverage(doc.tour);
//     next();
//   }
// );

reviewSchema.post('findOneAndUpdate', function(doc,next){
  // Not sure the post middleware is not working
  console.log('test');
  next()
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
