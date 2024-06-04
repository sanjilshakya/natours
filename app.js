const express = require("express");
const rateLimit = require("express-rate-limit");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// GLOBAL MIDDLEWARE
const limiter = rateLimit({
  // can only have 100 request in (60 * 60 * 1000) miliseconds
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again after an hour.",
});
app.use("/api", limiter);

app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} in this server`, 404));
});

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
