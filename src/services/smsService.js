const axios = require('axios');

module.exports.sendSms = (phone, content) => {
  let type = 'text';
  if (phone[0] == 0) {
    phone = '88' + phone;
  }
  if (phone[0] == '+') {
    phone = phone.replace('+', "");
  }
  
  let smsUrl = process.env.SMS_GATEWAY_URL + '?api_key=' + process.env.SMS_GATEWAY_API + '&smsType=' + type + '&mobileNo=' + phone + '&smsContent=' + content;
  // return;
  axios.post(smsUrl).then(response => {
    console.log(response.data);
  }).catch(error => {
    console.log(error)
  });
};