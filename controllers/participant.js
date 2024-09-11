const { Participant, Event } = require('../models');
const { Op } = require('sequelize');
const AccessToken = require('../helpers/accessToken');
const { sendResponse, sendData } = require('../helpers/response');

class ParticipantController {
  static async create(req, res, next) {
    try {
      const { code, fullname, bus } = req.body;

      //check if participant already exist
      const existingParticipant = await Participant.findOne({ 
        where: { code } 
      });
      if (Boolean(existingParticipant)) return sendResponse(400, 'Participant already exist', res);

      const participant = await Participant.create(
        { code, fullname, bus }
      );
      sendData(201, { code: participant.code, fullname: participant.fullname, bus: participant.bus }, "Success create participant", res);
    }
    catch (err) {
      next(err)
    };
  };

  static async findAllParticipants(req, res, next) {
    try {
      const participants = await Participant.findAll({
        include: {
          model: Event,
          required: false, // LEFT JOIN
        },
        order: [['fullname', 'asc']]
      });
      const data = { total_participant: participants.length, participants };
      sendData(200, data, "Success get all participants", res)
    }
    catch (err) {
      next(err);
    }
  };

  static async getParticipantsByEvent(req, res, next) {
    const event_id = req.params.event_id;
    try {
      const participants = await Participant.findAll({
        include: [{
          model: Event,
          where: { id: event_id },
          required: false,
          through: {
            attributes: []
          }
        }]
      });
    
      const participantsWithAttendance = participants.map(participant => {
        return {
          id: participant.id,
          fullname: participant.fullname,
          code: participant.code,
          bus: participant.bus,
          attendance: participant.Events.length > 0
        };
      });
      const leaderboardData = {
        total_participant: participantsWithAttendance.length,
        attend: participantsWithAttendance.filter(participant => participant.attendance === true).length,
        not_attend: participantsWithAttendance.filter(participant => participant.attendance === false).length
      }
      sendData(200, { leaderboard: leaderboardData, attendances: participantsWithAttendance }, "Success get all participants", res)   
    }     
    catch (err) {
      next(err);
    }
  };

  static async getParticipant(req, res, next) {
    const id = req.params.id
    try {
      const participant = await Participant.findOne({
        where: { id },
        include: {
          model: Event,
          required: false, // LEFT JOIN
        }
      })
      if (!participant) return sendResponse(404, "Participant not found", res)
      sendData(200, participant, "Success Get Detail Participant", res)
    } 
    catch (error) {
      next(error)
    }
  }

  static async checkinEvent(req, res, next) {
    const code = req.body.code;
    const event_id = req.params.event_id;
    try {
      //check if participant is exist
      const participant = await Participant.findOne({
        where: { code },
        include: {
          model: Event,
          required: false, // LEFT JOIN
        }
      })
      if (!participant) return sendResponse(404, "Participant not found", res)

      //get event
      const event = await Event.findOne({
        where: { id: event_id }
      })

      await participant.addEvent(event, { through: 'Event_Participant' });

      sendData(201, participant, `Success checkin to ${event.title}`, res)
    }
    catch (err) {
      next(err)
    }
  };

  static async update(req, res, next) {
    const id = req.params.id;
    const { code, fullname, bus } = req.body;
    try {
      //check if participant is exist
      const participant = await Participant.findOne({
        where: { id }
      })
      if (!participant) return sendResponse(404, "Participant is not found", res)

      //check if updated code is already used
      const participantWithSameCode = await Participant.findOne({
        where: { 
          [Op.and]: [
            { 
              id: {
                [Op.ne]: participant.id, 
              } 
            },
            { code }
          ]
        }
      })
      if (participantWithSameCode) return sendResponse(403, "Code already used", res)

      const updated = await Participant.update({ code, fullname, bus }, {
        where: { id },
        returning: true
      })
      sendResponse(200, "Success update participant", res)
    }
    catch (err) {
      next(err)
    }
  };
};

module.exports = ParticipantController;