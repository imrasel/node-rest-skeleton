const { validationResult  } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError =  require('../utils/httpError.response');
const User = require('../models/user');

module.exports.getById = async id => {
  let user;
  
  try {
    user = await User.findById(id);
  } catch(err) {
    return {
      error: true,
      message: err
    };
  }

  return user ?? {};
}

module.exports.getByQuery = async (query) => {
  let user;
  
  try {
    user = await User.findOne(query);
  } catch(err) {
    return {
      error: true,
      message: err
    };
  }

  return user;
}

module.exports.create = async (data) => {
  const user = User(data);

  try {
    await user.save();
  } catch (err) {
    return {
        error: true,
        message: err
    };
  }

  return user;
}

module.exports.get = async (req, res, next) => {

  let users;
  try {
    users = await User.find({});
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({ error: false, data: users });
}

module.exports.update = (data, id) => {
  console.log('Post request in users');
  // throw new HttpError('Could not find');

  return;
}

module.exports.delete = (id) => {

  return;
}
