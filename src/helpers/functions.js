const moment = require('moment');
const config = require('../config');
const Logger = require('../utils/logger');
const logger = new Logger('app').getLogger();

exports.formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD')
}
exports.getMonth = (date) => {
  return parseInt(moment(date).format('M'));
}
exports.requestLogger = (data, isProduction) => {
  let requestLogger = new Logger('Request Body').getLogger();
  if (isProduction) {
    requestLogger.debug(data)
  } else {
    config.env == 'development' ? requestLogger.debug(data) : null;
  }
}

exports.infoLogger = (message = '', data) => {
  logger.info(message, data)
}