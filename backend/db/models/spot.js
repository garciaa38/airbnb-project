'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE',
        as: 'Owner' });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'});

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE' });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE' });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Street address is required'
        },
        notEmpty: {
          msg: 'Street address is required'
        }
      }
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'City is required'
        },
        notEmpty: {
          msg: 'City is required'
        }
      }
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'State is required'
        },
        notEmpty: {
          msg: 'State is required'
        }
      }
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Country is required'
        },
        notEmpty: {
          msg: 'Country is required'
        }
      }
    },

    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        checkMinMax(value) {
          if (value > 90 || value < -90) {
            throw new Error('Latitude must be within -90 and 90');
          }
        }
      }
    },

    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        checkMinMax(value) {
          if (value > 180 || value < -180) {
            throw new Error('Longitude must be within -180 and 180');
          }
        }
      }
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkChar(value) {
          if (value.length > 50) {
            throw new Error('Name must be less than 50 characters')
          }
        },
        notNull: {
          msg: 'Name is required'
        },
        notEmpty: {
          msg: 'Name is required'
        }
      }
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        },
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },

    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        checkPrice(value) {
          if (value <= 0) {
            throw new Error('Price per day must be a positive number')
          }
        }
      }
    },

  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
