"use strict";

const createError = require("http-errors");
const { Todo } = require("../models");

module.exports = (req, res, next) => {
  Todo.findByPk(req.params.id)
    .then(task => {
      if (req.user.id != task.UserId) {
        throw createError(401);
      } else if (!task) {
        throw createError(404);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.status != 500) {
        next(err);
      } else {
        next(createError(500));
      }
    });
};
