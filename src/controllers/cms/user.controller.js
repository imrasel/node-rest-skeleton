const { validationResult  } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError =  require('../../utils/httpError.response');
const User = require('../../models/user');
const  userRepository  = require('../../repositories/user.repository');

module.exports.getById = async (req, res, next) => {
  const  userId = req.params.id;
  let user;
  let school;
  
  try {
    user = await User.findById(userId);
    if (user.school) {
      user.school = await School.findById(user.school)
    }
  } catch(err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find the user', 404);
    return next(error);
  }

  res.status(200).json({ error: false, data: user.toObject({ getters: true }), message: 'Success' });
}

module.exports.create = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) res.status(422).json(validationResult(req));

  const { name, password, email, phone, role } = req.body;

  // check user exists
  if (await userRepository.getByQuery({ email: email })) return next(new HttpError('User already exists', 422));

  // create hashed passwword
  let hashedPasssword;
  hashedPasssword = await bcrypt.hash(password, 12);

  const data = {
    name,
    email,
    password: hashedPasssword,
    phone,
    role,
  };

  let user = await userRepository.create(data);
  if (user.error) {
    return next(new HttpError(user.message, 500));
  }
  res.status(201).json({error: false, data: user, message: 'User create successfully' });
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

module.exports.update = (req, res, next) => {
  console.log('Put request in users');

  res.status(200).json({ data: {}, message: 'Success' });
}

module.exports.delete = (req, res, next) => {
  console.log('Delete request in users');

  res.status(200).json({ data: {}, message: 'Success' });
}
