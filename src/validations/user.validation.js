const { body, check } = require('express-validator');

module.exports.createValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').not().isEmpty().withMessage('Email is required'),
  check('password').not().isEmpty().withMessage('Password is required'),
];

module.exports.updateValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').not().isEmpty().withMessage('Email is required'),
];
