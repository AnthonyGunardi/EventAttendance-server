const { Event, Participant } = require('../models');
const { Op } = require('sequelize');
const AccessToken = require('../helpers/accessToken');
const { sendResponse, sendData } = require('../helpers/response');

class EventController {
  static async addEvent(req, res, next) {   
    try {
      const { title, description } = req.body

      //check if attendance is already exist
      const existing_event = await Event.findOne({ where: { title } });
      if (Boolean(existing_event)) return sendResponse(400, 'Event already exist', res)

      const event = await Event.create({ title, description });
      sendData(201, event, "Event is created", res);
    }
    catch (err) {
      next(err)
    };
  };

  static async getAllEvents(req, res, next) {
    try {
      const events = await Event.findAll({
        include: { 
          model: Participant,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      });
      sendData(200, events, "Success get all events", res)
    }
    catch (err) {
      next(err);
    }
  };

  static async update(req, res, next) {
    const id = req.params.id
    const { title, description } = req.body;
    try {
      //check if event is exist
      const event = await Event.findOne({
        where: { id }
      })
      if (!event) return sendResponse(404, "Event is not found", res)

      //check if updated event is already used
      const eventWithSameData = await Event.findOne({
        where: { title, description }
      })
      if (eventWithSameData) return sendResponse(403, "Event already exist", res)

      const updatedEvent = await Event.update(
        { title, description }, 
        { where: { id: event.id }, returning: true }
      )
      sendResponse(200, "Success update event", res)
    }
    catch (err) {
      next(err)
    }
  };
};

module.exports = EventController;