const express = require("express");
const { signup, login, protect } = require("../controllers/authController");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

//Protecting the routes with middleware
router.route("/").get(protect, getUsers);

module.exports = router;
