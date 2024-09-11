const route = require('express').Router();
const { ParticipantController } = require('../controllers');
const authentication = require('../middlewares/userAuthentication');
const adminAuthorization = require('../middlewares/adminAuthorization');

route.post('/', ParticipantController.create);
route.get('/', ParticipantController.findAllParticipants);
route.get('/:id', ParticipantController.getParticipant);
route.put('/:id', ParticipantController.update);
route.post('/:code', ParticipantController.checkinEvent);

module.exports = route;
