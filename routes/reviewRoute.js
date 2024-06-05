const express = require("express");
const {
  getReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewsController");
const { protect, restrictTo } = require("../controllers/authController");

// { mergeParams: true } to get the tourId from tourRout.js
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").delete(deleteReview);

module.exports = router;
