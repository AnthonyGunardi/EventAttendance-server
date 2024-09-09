'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Participant.belongsToMany(models.Event, {through: 'Event_Participant'})
    }
  }
  Participant.init({
    code: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: 'Code is Required'
        },
        notNull: {
          msg: 'Code is Required'
        }
      }
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: 'Full name is Required'
        },
        notNull: {
          msg: 'Full name is Required'
        }
      }
    },
    bus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Participant'
  });
  return Participant;
};