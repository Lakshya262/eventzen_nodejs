'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: {
        name: 'users_email',
        msg: 'Email address already in use'
      },
      validate: {
        isEmail: true,
        notEmpty: true
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100]
      }
    },
    role: { 
      type: DataTypes.ENUM("CUSTOMER", "ADMIN"), 
      defaultValue: "CUSTOMER",
      validate: {
        isIn: [["CUSTOMER", "ADMIN"]]
      }
    }
  }, {
    tableName: "users",
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] }
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Booking, {
      foreignKey: 'userId',
      as: 'bookings'
    });
  };
  

  return User;
};