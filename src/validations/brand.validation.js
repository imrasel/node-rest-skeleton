const { body, check } = require('express-validator');

module.exports.createValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
];

module.exports.updateValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
];



// export const createValidation = [
//   check('body').isLength({ min: 1 }).withMessage('Body is required'),
//   check('body.first_name').isLength({ min: 1 }).withMessage('First Name is required'),
//   check('body.age').isLength({ min: 1 }).withMessage('Age is required'),
//   check('body.gender').isLength({ min: 1 }).withMessage('Gender is required'),
//   check('body.nid').isLength({ min: 1 }).withMessage('NID is required'),
//   check('body.address').exists().withMessage('Address json is required'),
//   check('body.mobile').isLength({ min: 1 }).withMessage('Mobile is required'),

//   body('body.age')
//     .if((value, { req }) => req.body.body.age)
//     .custom((value, { req }) => Number.isInteger(req.body.body.age)).withMessage('Age should be integer'),

//   body('body.address')
//     .if((value, { req }) => req.body.body.address)
//     .custom((value, { req }) => req.body.body.address.district).withMessage('District is required in address')
//     .custom((value, { req }) => req.body.body.address.postal_code).withMessage('Postal code is required in address')
//     .custom((value, { req }) => req.body.body.address.village).withMessage('Village is required in address')
//     .custom((value, { req }) => req.body.body.address.street_name).withMessage('Street name is required in address'),

//   check('body.contact').exists().withMessage('Contact json is required'),
//   body('body.contact')
//     .if((value, { req }) => req.body.body.contact)
//     .custom((value, { req }) => req.body.body.contact.first_name).withMessage('First name is required in contact')
//     .custom((value, { req }) => req.body.body.contact.last_name).withMessage('Last name is required in contact')
//     .custom((value, { req }) => req.body.body.contact.relationship).withMessage('Relationship is required in contact')
//     .custom((value, { req }) => req.body.body.contact.mobile).withMessage('Mobile is required in contact'),

// ];

