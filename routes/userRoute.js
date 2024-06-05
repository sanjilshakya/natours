const express = require("express");
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const {
  getUsers,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/change-password", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

//Protecting the routes with middleware
router.route("/").get(protect, getUsers);

router.route("/:id").patch(updateUser).delete(deleteUser);

module.exports = router;
