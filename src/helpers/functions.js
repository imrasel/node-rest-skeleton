const moment = require('moment');

exports.formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD')
}
exports.getMonth = (date) => {
  return parseInt(moment(date).format('M'));
}