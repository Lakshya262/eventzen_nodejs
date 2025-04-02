'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.belongsTo(models.Event, { 
        foreignKey: 'eventId',
        as: 'event',
        onDelete: 'CASCADE'
      });
      this.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });
    }
  }

  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled', 'pending'),
      defaultValue: 'confirmed',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'eventId']
      }
    ]
  });

  return Booking;
};