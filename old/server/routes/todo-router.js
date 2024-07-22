"use strict";

const todoRouter = require("express").Router();
const authorize = require("../middlewares/authorize");
const { TodoController } = require("../controllers/todo-controller");

todoRouter.get("/", TodoController.findAll);
todoRouter.post("/", TodoController.create);
todoRouter.get("/:id", authorize, TodoController.findOne);
todoRouter.put("/:id", authorize, TodoController.update);
todoRouter.delete("/:id", authorize, TodoController.destroy);

module.exports = {
  todoRouter
};