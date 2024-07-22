"use strict";

if (process.env.NODE_ENV == "development") {
  require("dotenv").config();
}

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { User } = require("../models");

class UserController {
  static googleSignIn(req, res, next) {
    let payload = null;
    client
      .verifyIdToken({
        idToken: req.body.google_token,
        audience: process.env.CLIENT_ID
      })
      .then(response => {
        payload = response.getPayload();
        return User.findOne({ where: { email: payload.email } });
      })
      .then(user => {
        if (!user) {
          return User.create({ email: payload.email });
        } else {
          const userData = {
            id: user.id,
            email: payload.email
          };
          res.status(200).json({
            token: jwt.sign(userData, process.env.SECRET_KEY)
          });
          next();
        }
      })
      .then(newUser => {
        const newUserData = {
          id: newUser.id,
          email: payload.email
        };
        res.status(200).json({
          token: jwt.sign(newUserData, process.env.SECRET_KEY)
        });
        next();
      })
      .catch(err => {
        if (err.status != 500) {
          next(err);
        }
        next(createError(500));
      });
  }

  static login(req, res, next) {
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          throw createError(404, "User not found!");
        } else {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const userData = {
              id: user.id,
              email: user.email
            };
            res
              .status(200)
              .json({ token: jwt.sign(userData, process.env.SECRET_KEY) });
            next();
          } else {
            throw createError(400, "Wrong email or password!");
          }
        }
      })
      .catch(err => {
        if (err.status != 500) {
          next(err);
        } else {
          next(createError(500));
        }
      });
  }

  static register(req, res, next) {
    const userData = {
      email: req.body.email,
      password: req.body.password
    };

    User.create(userData)
      .then(user => {
        const emailText = `Welcome to Fancy Todo!`;
        const emailHTML = `<h3>Welcome to Fancy Todo!</h3>`;
        sendGrid(
          req.user.email,
          `Welcome to Fancy Todo!`,
          emailText,
          emailHTML
        );
        res.status(201).json({
          email: userData.email,
          message: "Please login to continue!"
        });
      })
      .catch(err => {
        if (
          typeof err.message != "undefined" &&
          err.message.includes("Validation error:")
        ) {
          next(createError(400, err.message));
        } else if (err.status != 500) {
          next(err);
        } else {
          next(createError(500));
        }
      });
  }
}

module.exports = {
  UserController
};
