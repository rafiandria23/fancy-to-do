'use strict';

const bcrypt = require("bcrypt");
const createError = require("http-errors");

module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize;

  class User extends Model { }
  
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Please provide proper email format!"
          },
          notNull: {
            args: true,
            msg: "Email cannot be empty!"
          },
          notEmpty: {
            args: true,
            msg: "Email cannot be empty!"
          },
          alreadyTaken: value => {
            User.findOne({ where: { email: value } }).then(foundUser => {
              if (foundUser) {
                throw createError(400, "Email is already taken!");
              }
            });
          }
        }
      },
      password: {
        type: DataTypes.STRING
      }
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
          }
        }
      },
      sequelize
    }
  );

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Todo);
  };

  return User;
};