const { sendResponse, sendData } = require('../helpers/response.js');

const errorHandler = (err, req, res, next) => {
  if (err.status) {
      sendResponse(err.status, err.message, res)
  } else if (err.name == `SequelizeValidationError` || err.name == `SequelizeUniqueConstraintError`) {
      let errors = [];
      for (let i = 0; i < err.errors.length; i++) {
          const element = err.errors[i];
          if (element.message == `Full name is Required`) {
            errors.push(`Fullname is Required`);
          }
          else {
              errors.push(element.message);
          }
      }
      let error = errors.join(', ');
      sendResponse(400, error, res);
  } else if (err.name == `SequelizeDatabaseError`) {

  } else {
      sendResponse(500, 'Internal server error', res);
  }
}

module.exports = errorHandler