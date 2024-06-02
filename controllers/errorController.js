module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
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
    console.error("Error", error);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong.",
    });
  }
};
