const route = require('express').Router();
const { ParticipantController } = require('../controllers');
const authentication = require('../middlewares/userAuthentication');
const adminAuthorization = require('../middlewares/adminAuthorization');

route.get('/', ParticipantController.findAllParticipants);
route.get('/unboarded/:bus_number', ParticipantController.getParticipantsNotOnBus);
route.put('/checkin_bus/:id', ParticipantController.checkinBus);
route.put('/reset/bus', ParticipantController.resetAllBusStatus);
route.get('/:id', ParticipantController.getParticipant);

module.exports = route;
