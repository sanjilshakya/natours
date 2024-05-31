const express = require("express");
const router = express.Router();
const {
  aliasTopTours,
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");

router.route("/top-5-tours").get(aliasTopTours, getTours);
router.route("/").get(getTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
