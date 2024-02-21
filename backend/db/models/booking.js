'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE' });

      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE' });
    }
  }
  Booking.init({
    userId: {
      type: DataTypes.INTEGER
    },

    spotId: {
      type: DataTypes.INTEGER
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};