const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error?.reason?.name === "BSONError") error = handleCastErrorDB(error);
    if (error?.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error?.errors) error = handleValidationErrorDB(error);
    if (error?.name === "JsonWebTokenError") error = handleJWTError();
    if (error?.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendErrorProd(error, res);
  }
};

sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

sendErrorProd = (err, res) => {
  //  Operational , trusted error: send message to client
  if (err.isOperationalError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // programming or other unknown error: don't leak error details
  else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong.",
    });
  }
};

handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value:${value}. Please use another value`;
  return new AppError(message, 400);
};

handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

handleJWTError = () => {
  const message = `Invalid token. Please log in again`;
  return new AppError(message, 401);
};

handleTokenExpiredError = () => {
  const message = `Token expired. Please log in again`;
  return new AppError(message, 401);
};
