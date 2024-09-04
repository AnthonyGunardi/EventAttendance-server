const { Participant, Attendance } = require('../models');
const { Op } = require('sequelize');
const AccessToken = require('../helpers/accessToken');
const { sendResponse, sendData } = require('../helpers/response');

class ParticipantController {
  static async findAllParticipants(req, res, next) {
    const event_name = req.body.event_name;
    try {
      // const participants = await Participant.findAll({
      //   order: [['fullname', 'asc']]
      // });
      const participants = await Participant.findAll({
        include: {
          model: Attendance,
          required: false, // LEFT JOIN
          where: { event_name }
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

  static async getParticipantsNotOnBus(req, res, next) {
    const bus_number = req.params.bus_number;
    try {
      const participants = await Participant.findAll({
        where: { bus_number, get_on_bus: false },
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
        where: { id }
      })
      if (!participant) return sendResponse(404, "Participant not found", res)
      sendData(200, participant, "Success Get Detail Participant", res)
    } 
    catch (error) {
      next(error)
    }
  }

  static async checkinBus(req, res, next) {
    const id = req.params.id;
    try {
      const updated = await Participant.update({ get_on_bus: true }, {
        where: { id },
        returning: true
      })
      sendResponse(200, "Success update bus status", res)
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