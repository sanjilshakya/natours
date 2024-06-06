const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log("Could not connect to the database");
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

importData = async () => {
  try {
    const toursPromise = Tour.create(tours);
    const usersPromise = User.create(users, { validateBeforeSave: false });
    const reviewsPromise = Review.create(reviews);
    await Promise.all([toursPromise, usersPromise, reviewsPromise]);
    console.log("Data migrated to database");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

deleteData = async () => {
  try {
    const toursPromise = Tour.deleteMany();
    const usersPromise = User.deleteMany();
    const reviewsPromise = Review.deleteMany();
    await Promise.all([toursPromise, usersPromise, reviewsPromise]);
    console.log("All data deleted from the database");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteData();

//Run this script to import data or to delete the data from db
// node data/data-migration.js --import
// node data/data-migration.js --delete
