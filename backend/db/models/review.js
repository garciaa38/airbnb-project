'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE' });

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE' });

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE' });
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER
    },

    spotId: {
      type: DataTypes.INTEGER
    },

    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Review text is required"
        },
        notEmpty: {
          msg: "Review text is required"
        }
      }
    },

    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        checkNum(value) {
          if (value < 1 || value > 5) {
            throw new Error('Stars must be an integer from 1 to 5')
          }
        }
      }
    },

  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
