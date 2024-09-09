const { Participant, Event } = require('../models');
const { Op } = require('sequelize');
const AccessToken = require('../helpers/accessToken');
const { sendResponse, sendData } = require('../helpers/response');

class ParticipantController {
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
    const code = req.params.code;
    const event_id = req.body.event_id;
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

  static async resetAllBusStatus(req, res, next) {
    let resetData = {
      get_on_bus: false
    };
    try {
      const updated = await Participant.update(resetData, {
        where: { get_on_bus: true },
        returning: true
      })
      sendResponse(200, "Success update bus status for all participants", res)
    }
    catch (err) {
      next(err)
    }
  };
};

module.exports = ParticipantController;