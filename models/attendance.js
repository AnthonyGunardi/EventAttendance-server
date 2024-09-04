'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Participant, {foreignKey: 'participant_id', targetKey: 'id'})
    }
  }
  Attendance.init({
    event_name: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: {
          msg: 'Event name is Required'
        },
        notNull: {
          msg: 'Event name is Required'
        }
      }
    },
    participant_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};