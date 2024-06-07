const express = require("express");
const router = express.Router();
// const {
//   aliasTopTours,
//   getTours,
//   createTour,
//   getTour,
//   updateTour,
//   deleteTour,
// } = require("../controllers/tourController");

const {
  aliasTopTours,
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances
} = require("../controllers/tourController-refactor-3");
const { protect, restrictTo } = require("../controllers/authController");

const reviewRoute = require("../routes/reviewRoute");

router.route("/top-5-tours").get(aliasTopTours, getTours);
router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);
router
  .route("/")
  .get(getTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);

router
  .route("/distance/:latlng/unit/:unit")
  .get(getDistances);

router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// mounting nested route
router.use("/:tourId/reviews", reviewRoute);

module.exports = router;
