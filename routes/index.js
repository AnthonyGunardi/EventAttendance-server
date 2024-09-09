const route = require('express').Router();
const participantRoute = require('./participants');
const eventRoute = require('./events');

route.use('/v1/participants', participantRoute);
route.use('/v1/events', eventRoute);

module.exports = route;