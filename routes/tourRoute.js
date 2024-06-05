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
} = require("../controllers/tourController-refactor-2");
const { protect, restrictTo } = require("../controllers/authController");

const reviewRoute = require("../routes/reviewRoute");

router.route("/top-5-tours").get(aliasTopTours, getTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(getTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// mounting nested route
router.use("/:tourId/reviews", reviewRoute);

module.exports = router;
