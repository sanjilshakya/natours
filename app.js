const express = require("express");
const tourRouter = require("./routes/tourRoute");

const app = express();

app.use(express.json());

app.use("/api/v1/tours", tourRouter);

app.all("*", (req, res, next) => {
  res.status(400).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} in this server`,
  });
});

module.exports = app;
