"use strict";

const userRouter = require("express").Router();
const { UserController } = require("../controllers/user-controller");

userRouter.post("/login", UserController.login);
userRouter.post("/login/google", UserController.googleSignIn);
userRouter.post("/register", UserController.register);

module.exports = {
  userRouter
};