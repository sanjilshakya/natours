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

// DOCUMENT MIDDLEWARE:

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

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
