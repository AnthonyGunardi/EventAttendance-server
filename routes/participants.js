const route = require('express').Router();
const { ParticipantController } = require('../controllers');
const authentication = require('../middlewares/userAuthentication');
const adminAuthorization = require('../middlewares/adminAuthorization');

route.post('/', ParticipantController.create);
route.get('/', ParticipantController.findAllParticipants);
route.post('/files', ParticipantController.uploadParticipants);
route.get('/:id', ParticipantController.getParticipant);
route.put('/:id', ParticipantController.update);

module.exports = route;
