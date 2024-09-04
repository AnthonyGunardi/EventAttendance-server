const { Attendance, Participant } = require('../models');
const { Op } = require('sequelize');
const AccessToken = require('../helpers/accessToken');
const { sendResponse, sendData } = require('../helpers/response');

class AttendanceController {
  static async addAttendance(req, res, next) {   
    const id = req.params.id 
    try {
      const { event_name } = req.body

      //check if attendance is already exist
      const attendance = await Attendance.findOne({ where: { event_name, participant_id: id } });
      if (Boolean(attendance)) return sendResponse(400, 'Already attend', res)

      const newAttendance = await Attendance.create({ event_name, participant_id: id });
      sendData(201, newAttendance, "Attendance is created", res);
    }
    catch (err) {
      next(err)
    };
  };

  static async getAttendancesByEvent(req, res, next) {
    const event_name = req.body.event_name;
    try {
      const attendances = await Attendance.findAll({
        where: { event_name },
        include: { 
          model: Participant,
          attributes: {
            exclude: ['get_on_bus', 'createdAt', 'updatedAt']
          }
        },
        order: [['createdAt', 'desc']]
      });

      // get non-attendees
      const nonAttendees = await Participant.findAll({
        include: {
          model: Attendance,
          required: false, // LEFT JOIN
          where: { event_name },
        },
        where: {
          '$Attendances.event_name$': {
            [Op.is]: null, // Filter out those who have attended
          },
        },
      });
      const data = { total_attendances: attendances.length, total_not_attended: nonAttendees.length, attendances, not_attended: nonAttendees };
      sendData(200, data, "Success get all attendances", res)
    }
    catch (err) {
      next(err);
    }
  };
};

module.exports = AttendanceController;