const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factoryHandler = require("./handlerFactory");

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    count: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.getReview = factoryHandler.getOne(Review);
exports.createReview = factoryHandler.createOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
