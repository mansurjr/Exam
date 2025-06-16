function errorResponse(res, options = {}) {
  const {
    status = 500,
    message = "Internal Server Error",
    details = null,
    error = null,
  } = options;

  if (error) {
    console.error(error);
  }
  console.log(options);

  return res.status(status).json({
    success: false,
    error: message,
    ...(details && { details }),
  });
}

module.exports = { errorResponse };
