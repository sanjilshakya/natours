const mongoose = require("mongoose");
const slugify = require("slugify");
// const validatorPkg = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      minlength: [10, "Tour name must have more or equal to 10 characters"],
      maxlength: [40, "Tour name must have less or equal to 40 characters"],
      // validate: validatorPkg.isAlpha
      // validate: [
      //   validatorPkg.isAlpha,
      //   "Tour name must only contain characters",
      // ],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either: easy, medium or diffucult.",
      },
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      // Custom validation to check if priceDiscount should be less than price of the tour.
      validate: {
        validator: function (val) {
          // this only points to current doc on new doc. CREATION only. not on UPDATE
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round((val * 10) / 10),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
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
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  //To output vitrual properties:
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });

// Virtual Properties won't be saved in DB.
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "name",
  });
  next();
});

// AGGREGATION MIDDLEWARE:
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secret: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
