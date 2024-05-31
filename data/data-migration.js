const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Tour = require("../models/tourModel");

mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log("Could not connect to the database");
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Tours migrated to database");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("All tours deleted from the database");
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
