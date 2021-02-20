const HttpError = require('../utils/httpError.response')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return next(new HttpError('Unauthorized', 401));
    

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    let authUser = await User.findById(decodedData.userId);

    if (!authUser) return next(new HttpError('Unauthorized', 401));
    
    req.auth = { id: decodedData.userId, role: authUser.role }

    next();


  } catch(err) {
    console.log('hello');
    const error = new HttpError(err.message, 500);
    return next(error);
  }
}
