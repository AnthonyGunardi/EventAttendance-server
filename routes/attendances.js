const route = require('express').Router();
const { AttendanceController } = require('../controllers');

route.post('/:id', AttendanceController.addAttendance);
route.get('/', AttendanceController.getAttendancesByEvent);

module.exports = route;
