'use strict';

const today = new Date().toISOString();

module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize;

  class Todo extends Model { }
  
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Task title cannot be empty!"
          },
          notEmpty: {
            args: true,
            msg: "Task title cannot be empty!"
          }
        }
      },
      description: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      due_date: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            args: true,
            msg: "Please provide proper date format!"
          },
          isAfter: {
            args: `${today.split("T")[0]}`,
            msg: "Cannot create task with due date of today!"
          }
        }
      },
      UserId: DataTypes.INTEGER
    },
    { sequelize }
  );

  Todo.associate = function(models) {
    // associations can be defined here
    Todo.belongsTo(models.User);
  };
  
  return Todo;
};