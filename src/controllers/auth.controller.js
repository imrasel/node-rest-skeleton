const { validationResult  } = require('express-validator');
const { to } = require("await-to-js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError =  require('../utils/httpError.response');
const User = require('../models/user');
const BaseController = require("./common//base.controller");

const AuthRepository = require("../repositories/auth.repository");
const authRepository = new AuthRepository();
const ErrorHandler = require("../utils/errorHandler");
const { validation, success } = require('../utils/http.response');

// module.exports.login = async (req, res, next) => {
//   //check validations
//   if (!validationResult(req).isEmpty()) res.status(422).json(validationResult(req));

//   const { email, password } = req.body;

//   let user;
//   try {
//     user = await User.findOne({ email: email }).select('+password');
//   } catch(err) {
//     const error = new HttpError(err, 500);
//     return next(error);
//   }
//   if (!user) {
//     throw new HttpError('Could not find the user', 404)
//   }

//   let isValidPassword = false;
//   try {
//     isValidPassword = await bcrypt.compare(password, user.password);
//   } catch(err) {
//     const error = new HttpError(err, 500);
//     return next(error);
//   }
//   if (!isValidPassword) {
//     const error = new HttpError('Credentials are invalid', 500);
//     return next(error);
//   }

//   let token;
//   token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '10h'});
//   user = user.toJSON();
//   delete user.password;
//   if (token) {
//     user.token = token;
//   }

//   res.status(200).json({error: false, data: user, message: 'Logged in!' });
// }

module.exports = class AuthController extends BaseController {
  constructor() {
    super("auth", authRepository);
    this._repository = authRepository;
  }

  async register(req, res, next) {
    if (!validationResult(req).isEmpty())
      return res.status(422).json(validation(validationResult(req).errors, res.statusCode));
    
    try {
      let user = req.body;
      let hashedPasssword = await bcrypt.hash(user.password, 12);
      user.password = hashedPasssword;
      const [err, data] = await to(this._repository.create(user));
      ErrorHandler.handleError(err);
      delete data.password;

      return res.status(200).json(success("OK", { data }, res.statusCode));
    } catch (error) {
      this._logger.error("Error: ", error.stack);
      return next(new HttpError(`Registration failed.`, 500));
    }
  }

  async login(req, res, next) {
    if (!validationResult(req).isEmpty())
      return res.status(422).json(validation(validationResult(req).errors, res.statusCode));

    const { email, password } = req.body;
    let user;
    try {
      const [err, data] = await to(this._repository.getOne({email: email}));
      ErrorHandler.handleError(err);

      user = data;

    } catch(error) {
      this._logger.error("Error: ", error.stack);
      return next(new HttpError(`Login failed.`, 500));
    }
    if (!user) {
      return next(new HttpError('Could not find the user', 404));
    }
  
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log(isValidPassword)
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

};
