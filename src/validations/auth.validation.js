const { body, check } = require('express-validator');

module.exports.loginValidation = [
  check('email').not().isEmpty().withMessage('Email is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
];

module.exports.registerValidation = [
  check('email').not().isEmpty().withMessage('Email is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
  check('name').not().isEmpty().withMessage('Name is required'),
];
