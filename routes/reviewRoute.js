const express = require("express");
const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewsController");
const { protect, restrictTo } = require("../controllers/authController");

// { mergeParams: true } to get the tourId from tourRout.js
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").patch(updateReview).delete(deleteReview);

module.exports = router;
