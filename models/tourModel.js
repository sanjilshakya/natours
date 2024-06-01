const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // hide this field on output.
      select: false,
    },
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false,
    },
  },
  //To output vitrual properties:
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Properties won't be saved in DB.
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: "save"

// pre middleware "save" Runs before .save() and .create() only
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// post middleware 'save' runs after .save() and .create() only and has access to res and next function
// tourSchema.post('save', function(res, next){
//   do something
//  next()
// })

//QUERY MIDDLEWARE: "find"
// tourSchema.pre("find", function (next) {  --> only works on find()
// to make it work on every find we use regular expression as: /^find/ which works on find(), findOne(), findById(),
// findByIdAndUpdate(), findByIdAndUpdate()
tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE:
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
