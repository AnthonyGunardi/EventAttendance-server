const route = require('express').Router();
const { EventController } = require('../controllers');

route.post('/', EventController.addEvent);
route.get('/', EventController.getAllEvents);
route.put('/:id', EventController.update);

module.exports = route;
