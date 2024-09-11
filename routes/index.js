const route = require('express').Router();
const participantRoute = require('./participants');
const eventRoute = require('./events');
const attendanceRoute = require('./attendances');

route.use('/v1/participants', participantRoute);
route.use('/v1/events', eventRoute);
route.use('/v1/attendances', attendanceRoute);

module.exports = route;