const { Participant, Event } = require('../models');
const { Op } = require('sequelize');
const AccessToken = require('../helpers/accessToken');
const { sendResponse, sendData } = require('../helpers/response');
const path = require('node:path');
const { importDataFromCsv } = require('../helpers/importCsv');

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
      //check if event is exist
      const event = await Event.findOne({
        where: { id: event_id }
      })
      if (!event) return sendResponse(200, "Event is not found", res);

      const participants = await Participant.findAll({
        include: {
          model: Event,
          where: { id: event_id },
          required: false,
          through: {
            attributes: []
          }
        }
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

      //check if participant already checkin
      const alreadyCheckedIn = await participant.hasEvent(event);
      if (alreadyCheckedIn) return sendResponse(409, "Already checked in", res)
      
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

  static async uploadParticipants(req, res, next) {
    try {
      //upload file if req.files isn't null
      let url = null;
      if (req.files !== null) {
        const file = req.files.fileCsv;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const allowedType = ['.csv'];
        url = `participants/${fileName}`;

        //validate file type
        if(!allowedType.includes(ext.toLocaleLowerCase())) return sendResponse(422, "File must have extension csv", res)    
        //place the file on server
        file.mv(`./public/participants/${fileName}`, async (err) => {
          if(err) return sendResponse(502, err.message, res)
        })
      

      //import data from csv
      const data = await importDataFromCsv(`./public/${url}`);
      const parsed = JSON.parse(data)
      if (!parsed.fullname) return sendResponse(502, "Error reading file", res)
      console.log(JSON.parse(data))
      await Participant.bulkCreate(JSON.parse(data));
      sendResponse(201, "Success upload participants", res)
      // sendResponse(201, JSON.parse(data), res)
    }
    }
    catch (err) {
      next(err)
    }
  }
};

module.exports = ParticipantController;