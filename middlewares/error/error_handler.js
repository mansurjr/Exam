const ApiError = require("../../error/api.error");

module.exports = (err, _, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).send({
      message: err.message,
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(err.status).send({
      message: err.message,
    });
  }

  return res.status(500).send({
    message: "Something went wrong",
  });
};
