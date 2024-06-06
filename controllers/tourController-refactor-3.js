const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const factoryHandler = require("./handlerFactory");

exports.aliasTopTours = (req, res, next) => {
  req.query = {
    limit: 5,
    sort: "-ratingsAverage,price",
    fields: "name,price,ratingsAverage,summary,difficulty",
  };
  next();
};

exports.getTours = factoryHandler.getAll(Tour);

exports.createTour = factoryHandler.createOne(Tour);

exports.getTour = factoryHandler.getOne(Tour, {
  path: "reviews",
});

exports.updateTour = factoryHandler.updateOne(Tour);

exports.deleteTour = factoryHandler.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numToursStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    // {
    //   $limit: 6
    // }
  ]);

  res.status(200).json({
    status: "success",
    count: plan.length,
    data: {
      plan,
    },
  });
});
