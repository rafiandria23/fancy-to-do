"use strict";

if (process.env.NODE_ENV == 'development') {
  require("dotenv").config();
}

const { Todo } = require("../models");
const createError = require("http-errors");
const sendGrid = require("../helpers/sendgrid-api");

class TodoController {
  static findAll(req, res, next) {
    Todo.findAll({ where: { UserId: req.user.id } })
      .then(todos => {
        if (!todos) {
          res.status(200).json({message: "You have no tasks, let's create one!"});
        }
        else {
          res.status(200).json(todos);
        }
      })
      .catch(err => {
        if (err.status != 500) {
          next(err);
        }
        else {
          next(createError(500));
        }
      });
  }

  static create(req, res, next) {
    const todoData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date,
      UserId: req.user.id
    };

    let createdTodo = null;

    Todo.create(todoData)
      .then(todo => {
        createdTodo = todo;
        const emailText = `Welcome to Fancy Todo! You just created a task - ${createdTodo.title}.`;
        const emailHTML = `<h3>Welcome to Fancy Todo! You just created a task - ${createdTodo.title}.</h3>`;
        sendGrid(req.user.email, `Created Todo - ${createdTodo.title}`, emailText, emailHTML);
        res.status(201).json(createdTodo);
      })
      .catch(err => {
        if (err.message.includes("Validation error:")) {
          next(createError(400, err.message));
        }
        else {
          next(createError(500));
        }
      });
  }

  static findOne(req, res, next) {
    Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      .then(todos => {
        if (!todos) {
          throw createError(404);
        }
        else {
          res.status(200).json(todos);
        }
      })
      .catch(err => {
        if (err.status != 500) {
          next(err);
        }
        else {
          next(createError(500));
        }
      });
  }

  static update(req, res, next) {
    const todoData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date,
      updatedAt: Date.now()
    };

    Todo.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    })
      .then(todo => {
        if (!todo) {
          throw createError(404);
        }
        else {
          return Todo.update(todoData, {
            where: {
              id: req.params.id,
              UserId: req.user.id
            }
          });
        }
      })
      .then(todo => {
          return Todo.findOne({
            where: {
              id: req.params.id,
              UserId: req.user.id
            }
          });
      })
      .then(todo => {
        res.status(200).json(todo);
      })
      .catch(err => {
        if (typeof err.message != "undefined" && err.message.includes("Validation error:")) {
          next(createError(400, err.message));
        }
        else if (err.status != 500) {
          next(err);
        }
        else {
          next(createError(500));
        }
      });
  }

  static destroy(req, res, next) {
    let deletedTodo = null;

    Todo.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      .then(todo => {
        if (!todo) {
          throw createError(404);
        }
        else {
          deletedTodo = todo;
          return Todo.destroy({
            where: {
              id: req.params.id,
              UserId: req.user.id
            }
          });
        }
      })
      .then(todo => {
        res.status(200).json(deletedTodo);
      })
      .catch(err => {
        if (err.status != 500) {
          next(err);
        }
        else {
          next(createError(500));
        }
      });
  }
}

module.exports = {
  TodoController
};