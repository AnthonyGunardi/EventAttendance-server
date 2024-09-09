const route = require('express').Router();
const { ParticipantController } = require('../controllers');
const authentication = require('../middlewares/userAuthentication');
const adminAuthorization = require('../middlewares/adminAuthorization');

route.get('/', ParticipantController.findAllParticipants);
route.get('/:id', ParticipantController.getParticipant);

module.exports = route;
