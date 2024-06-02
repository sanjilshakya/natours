const express = require("express");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

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
