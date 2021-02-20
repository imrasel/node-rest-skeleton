const { validationResult  } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError =  require('../../utils/httpError.response');
const User = require('../../models/user');

module.exports.login = async (req, res, next) => {
  //check validations
  if (!validationResult(req).isEmpty()) res.status(422).json(validationResult(req));

  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email }).select('+password');
  } catch(err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  if (!user) {
    throw new HttpError('Could not find the user', 404)
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch(err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError('Credentials are invalid', 500);
    return next(error);
  }

  let token;
  token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '10h'});
  user = user.toJSON();
  delete user.password;
  if (token) {
    user.token = token;
  }

  res.status(200).json({error: false, data: user, message: 'Logged in!' });
}
