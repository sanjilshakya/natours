const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT REJECTION !!! SHUTTING DOWN ...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => {
    console.log("Database Connection Successful");
  });

const server = app.listen(PORT, () => {
  console.log("Listening to the port:", PORT);
});

//Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION !!! SHUTTING DOWN ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
