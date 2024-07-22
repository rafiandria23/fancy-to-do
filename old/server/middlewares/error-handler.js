"use strict";

module.exports = (err, req, res, next) => {
  if (err) {
    switch (err.status) {
      case 404 && typeof err.message == "undefined":
        res.status(err.status).json({
          message: "Ooops! Looks like it's not here."
        });
        break

      case 401:
        res.status(err.status).json({
          message: "You are not authorized!"
        });
        break;

      case 500:
        res.status(err.status).json({
          message: "Internal server error!"
        });
        break;

      default:
        res.status(err.status).json({
          message: err.message
        });
        break;
    }
  }
  else {
    next();
  }
};