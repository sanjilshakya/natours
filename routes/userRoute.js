const express = require("express");
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require("../controllers/authController");
const {
  getUsers,
  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getUser,
  getMe,
  uploadUserPhoto,
  resizeuserPhoto,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Since we need to protect middleware in all of the routes below: we use another middleware like:
router.use(protect);

// No need to include protect middleware on the routes, since we already use middleware above
router.patch("/change-password", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/updateMe", uploadUserPhoto, resizeuserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
