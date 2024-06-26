const express = require("express");
const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourAndUserIds,
  getReview,
} = require("../controllers/reviewsController");
const { protect, restrictTo } = require("../controllers/authController");

// { mergeParams: true } to get the tourId from tourRout.js
const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getReviews)
  .post(restrictTo("user"), setTourAndUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
