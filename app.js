const express = require("express");
const tourRouter = require("./routes/tourRoute");

const app = express();

app.use(express.json());

app.use("/api/v1/tours", tourRouter);

//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `Cannot find ${req.originalUrl} in this server`,
  //   });

  const error = new Error(`Cannot find ${req.originalUrl} in this server`);
  error.status = "fail";
  error.statusCode = 404;

  next(error);
});

// Global Error Handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
