const express = require("express");
const {
  getReviews,
  createReview,
} = require("../controllers/reviewsController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), createReview);

module.exports = router;
