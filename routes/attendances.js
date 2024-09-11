const route = require('express').Router();
const { ParticipantController } = require('../controllers');

route.post('/:event_id', ParticipantController.checkinEvent);
route.get('/:event_id', ParticipantController.getParticipantsByEvent);

module.exports = route;