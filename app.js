const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// GLOBAL MIDDLEWARE
// Set security http headers
app.use(helmet());

// Limit request
const limiter = rateLimit({
  // can only have 100 request in (60 * 60 * 1000) miliseconds
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again after an hour.",
});
app.use("/api", limiter);

// Body parser, reading data from req.body and set the size limit of body
app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(hpp()); - doesn't allow duplicates in params. eg: sort="duration"&sort="price"
app.use(
  hpp({
    // to allow duplicates
    whitelist: ["duration", "ratingsQuantity", "ratingsAverage", "difficulty"],
  })
);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

//Handling Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} in this server`, 404));
});

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
