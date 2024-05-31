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
} = require("../controllers/tourController-refactor");

router.route("/top-5-tours").get(aliasTopTours, getTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(getTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
