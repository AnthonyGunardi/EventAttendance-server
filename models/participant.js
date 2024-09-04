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
      Participant.hasMany(models.Attendance, {foreignKey: 'participant_id', sourceKey: 'id'})
    }
  }
  Participant.init({
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
    bus_number: DataTypes.STRING,
    get_on_bus: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Participant'
  });
  return Participant;
};